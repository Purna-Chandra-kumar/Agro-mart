import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DigiLockerTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DigiLockerUserProfile {
  name: string;
  dob: string;
  gender: string;
  aadhaar: string; // Masked Aadhaar number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    let action = url.searchParams.get('action');
    
    // Handle POST requests with action in body
    if (req.method === 'POST' && !action) {
      const body = await req.json();
      action = body.action;
    }

    if (action === 'initiate') {
      // Step 1: Initiate DigiLocker OAuth flow
      const clientId = Deno.env.get('DIGILOCKER_CLIENT_ID');
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/digilocker-auth?action=callback`;
      
      if (!clientId) {
        throw new Error('DigiLocker Client ID not configured');
      }

      const authUrl = new URL('https://api.digilocker.gov.in/auth/authorize');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'profile');
      authUrl.searchParams.set('state', crypto.randomUUID()); // CSRF protection

      return new Response(
        JSON.stringify({ authUrl: authUrl.toString() }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (action === 'callback') {
      // Step 2: Handle DigiLocker callback and exchange code for token
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (!code) {
        throw new Error('Authorization code not received');
      }

      const clientId = Deno.env.get('DIGILOCKER_CLIENT_ID');
      const clientSecret = Deno.env.get('DIGILOCKER_CLIENT_SECRET');
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/digilocker-auth?action=callback`;

      if (!clientId || !clientSecret) {
        throw new Error('DigiLocker credentials not configured');
      }

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://api.digilocker.gov.in/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange authorization code for token');
      }

      const tokenData: DigiLockerTokenResponse = await tokenResponse.json();

      // Fetch user profile using access token
      const profileResponse = await fetch('https://api.digilocker.gov.in/user/profile', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile from DigiLocker');
      }

      const profileData: DigiLockerUserProfile = await profileResponse.json();

      // Find or create user in our database
      const maskedAadhaar = profileData.aadhaar; // Already masked by DigiLocker
      const dob = profileData.dob;
      const name = profileData.name;

      // Check if user exists with this masked Aadhaar and DOB
      const { data: existingProfile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('user_id, name')
        .eq('aadhar_number', maskedAadhaar)
        .eq('date_of_birth', dob)
        .eq('user_type', 'farmer')
        .single();

      let userId;

      if (existingProfile) {
        // User exists, use existing user ID
        userId = existingProfile.user_id;
      } else {
        // Create new user with DigiLocker verified data
        const generatedEmail = `farmer_${maskedAadhaar.replace(/\*/g, 'X')}@digilocker.verified`;
        const tempPassword = crypto.randomUUID(); // Generate temp password

        const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
          email: generatedEmail,
          password: tempPassword,
          user_metadata: {
            name: name,
            user_type: 'farmer',
            aadhar_number: maskedAadhaar,
            date_of_birth: dob,
            verified_via_digilocker: true,
          },
        });

        if (authError || !authData.user) {
          throw new Error('Failed to create user account');
        }

        userId = authData.user.id;
      }

      // Generate a session token for the frontend
      const sessionToken = await supabaseClient.auth.admin.generateLink({
        type: 'magiclink',
        email: `farmer_${maskedAadhaar.replace(/\*/g, 'X')}@digilocker.verified`,
      });

      // Redirect to frontend with session token
      const frontendUrl = Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovableproject.com') || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/auth?digilocker_token=${encodeURIComponent(sessionToken.data.hashed_token || '')}&user_type=farmer`;

      return Response.redirect(redirectUrl, 302);
    }

    // Handle login verification from frontend
    if (req.method === 'POST' && !action) {
      const { token } = await req.json();

      if (!token) {
        throw new Error('Session token required');
      }

      // Verify the session token
      const { data: session, error: sessionError } = await supabaseClient.auth.verifyOtp({
        token_hash: token,
        type: 'magiclink',
      });

      if (sessionError || !session.user) {
        throw new Error('Invalid or expired session token');
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          user: session.user,
          session: session.session,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    throw new Error('Invalid request');

  } catch (error) {
    console.error('DigiLocker Auth Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Authentication failed',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});