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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, otp } = await req.json();

    if (!phoneNumber || !otp) {
      throw new Error('Phone number and OTP are required');
    }

    // Find valid OTP
    const { data: otpData, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('otp_code', otp)
      .gt('expires_at', new Date().toISOString())
      .is('verified_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      // Increment attempts for this phone number
      await supabase
        .from('otp_verifications')
        .update({ attempts: supabase.sql`attempts + 1` })
        .eq('phone_number', phoneNumber)
        .eq('otp_code', otp);

      throw new Error('Invalid or expired OTP');
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('otp_verifications')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', otpData.id);

    if (updateError) {
      console.error('Error updating OTP:', updateError);
      throw new Error('Verification failed');
    }

    // Clean up old OTPs for this phone number
    await supabase
      .from('otp_verifications')
      .delete()
      .eq('phone_number', phoneNumber)
      .neq('id', otpData.id);

    console.log('OTP verified successfully for', phoneNumber);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully',
        verified: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-otp function:', error);
    return new Response(
      JSON.stringify({ error: error.message, verified: false }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});