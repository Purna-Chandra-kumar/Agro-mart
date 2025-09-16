import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

function validateAadhaar(aadhaar: string): boolean {
  return /^\d{12}$/.test(aadhaar);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, aadhaarNumber, name, dateOfBirth, phoneNumber } = await req.json();

    if (!validateAadhaar(aadhaarNumber)) {
      throw new Error('Please enter a valid Aadhaar number');
    }

    if (action === 'signup') {
      if (!name || !dateOfBirth || !phoneNumber) {
        throw new Error('All fields are required for signup');
      }

      // Check if Aadhaar already exists
      const { data: existingUser } = await supabase
        .from('aadhaar_auth')
        .select('*')
        .eq('aadhaar_number', aadhaarNumber)
        .single();

      if (existingUser) {
        throw new Error('Aadhaar number already registered');
      }

      // Create new Aadhaar auth record
      const { data: authData, error: authError } = await supabase
        .from('aadhaar_auth')
        .insert({
          aadhaar_number: aadhaarNumber,
          phone_number: phoneNumber,
          name: name,
          date_of_birth: dateOfBirth,
          is_verified: false
        })
        .select()
        .single();

      if (authError) {
        console.error('Error creating Aadhaar auth:', authError);
        throw new Error('Registration failed');
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Registration successful',
          user: authData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'login') {
      // Find user by Aadhaar
      const { data: userData, error: userError } = await supabase
        .from('aadhaar_auth')
        .select('*')
        .eq('aadhaar_number', aadhaarNumber)
        .single();

      if (userError || !userData) {
        throw new Error('Aadhaar number not found. Please register first.');
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'User found',
          user: userData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'verify') {
      // Mark user as verified
      const { data: updatedUser, error: updateError } = await supabase
        .from('aadhaar_auth')
        .update({ is_verified: true })
        .eq('aadhaar_number', aadhaarNumber)
        .select()
        .single();

      if (updateError) {
        console.error('Error verifying user:', updateError);
        throw new Error('Verification failed');
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'User verified successfully',
          user: updatedUser
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in aadhaar-auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});