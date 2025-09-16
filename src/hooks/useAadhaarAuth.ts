import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateAadhaar } from '@/utils/validation';

interface AadhaarAuthData {
  aadhaarNumber: string;
  name?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
}

export const useAadhaarAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'otp' | 'complete'>('input');
  const [currentData, setCurrentData] = useState<AadhaarAuthData | null>(null);

  const validateInput = (data: AadhaarAuthData, isSignup: boolean) => {
    if (!validateAadhaar(data.aadhaarNumber)) {
      toast({
        title: 'Invalid Aadhaar',
        description: 'Please enter a valid 12-digit Aadhaar number',
        variant: 'destructive',
      });
      return false;
    }

    if (isSignup && (!data.name || !data.dateOfBirth || !data.phoneNumber)) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSignup = async (data: AadhaarAuthData) => {
    if (!validateInput(data, true)) return;

    setIsLoading(true);
    setCurrentData(data);

    try {
      // Register with Aadhaar system
      const { data: authResult, error: authError } = await supabase.functions.invoke('aadhaar-auth', {
        body: {
          action: 'signup',
          aadhaarNumber: data.aadhaarNumber,
          name: data.name,
          dateOfBirth: data.dateOfBirth,
          phoneNumber: data.phoneNumber
        }
      });

      if (authError) throw authError;

      // Send OTP
      const { data: otpResult, error: otpError } = await supabase.functions.invoke('send-otp', {
        body: {
          phoneNumber: data.phoneNumber,
          type: 'signup'
        }
      });

      if (otpError) throw otpError;

      toast({
        title: 'OTP Sent',
        description: `Verification code sent to ${data.phoneNumber}`,
      });

      setStep('otp');
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Failed to register',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: AadhaarAuthData) => {
    if (!validateInput(data, false)) return;

    setIsLoading(true);
    setCurrentData(data);

    try {
      // Check if user exists
      const { data: authResult, error: authError } = await supabase.functions.invoke('aadhaar-auth', {
        body: {
          action: 'login',
          aadhaarNumber: data.aadhaarNumber
        }
      });

      if (authError) throw authError;

      const phoneNumber = authResult.user.phone_number;

      // Send OTP to registered phone
      const { data: otpResult, error: otpError } = await supabase.functions.invoke('send-otp', {
        body: {
          phoneNumber: phoneNumber,
          type: 'login'
        }
      });

      if (otpError) throw otpError;

      toast({
        title: 'OTP Sent',
        description: `Verification code sent to ${phoneNumber}`,
      });

      setCurrentData({ ...data, phoneNumber });
      setStep('otp');
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Failed to login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerified = async () => {
    if (!currentData) return;

    setIsLoading(true);

    try {
      // Verify user in Aadhaar system
      const { data: verifyResult, error: verifyError } = await supabase.functions.invoke('aadhaar-auth', {
        body: {
          action: 'verify',
          aadhaarNumber: currentData.aadhaarNumber
        }
      });

      if (verifyError) throw verifyError;

      // Create or update profile in regular profiles table
      const profileData = {
        user_id: crypto.randomUUID(), // Generate UUID for compatibility
        name: verifyResult.user.name,
        phone: verifyResult.user.phone_number,
        user_type: 'farmer',
        aadhar_number: verifyResult.user.aadhaar_number,
        date_of_birth: verifyResult.user.date_of_birth,
        verified: true,
        profile_completed: true
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (profileError) {
        console.warn('Profile creation warning:', profileError);
      }

      toast({
        title: 'Success',
        description: 'Authentication successful!',
      });

      setStep('complete');
      navigate('/farmer-dashboard');
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Failed to complete verification',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setStep('input');
    setCurrentData(null);
  };

  return {
    isLoading,
    step,
    currentData,
    handleSignup,
    handleLogin,
    handleOTPVerified,
    handleCancel
  };
};