import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { supabaseUserStore } from '@/store/supabaseUserStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const validateAadhaar = (aadhaar: string) => {
    return /^\d{12}$/.test(aadhaar);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && 
           /\d/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const handleLogin = async (formData: any, userType: string, farmerAuthMethod?: string) => {
    setIsLoading(true);

    if (userType === 'farmer' && farmerAuthMethod === 'aadhaar') {
      if (!validateAadhaar(formData.aadharNumber)) {
        toast({
          title: 'Invalid Aadhaar',
          description: 'Aadhaar number should be exactly 12 digits',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      let email = formData.email;
      
      if (userType === 'farmer' && farmerAuthMethod === 'aadhaar') {
        email = `farmer_${formData.aadharNumber}@internal.local`;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await supabaseUserStore.getProfile(session.user.id);
        
        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in',
        });

        if (profile?.user_type === 'farmer') {
          navigate('/farmer-dashboard');
        } else {
          navigate('/buyer-dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (formData: any, userType: string, farmerAuthMethod?: string) => {
    setIsLoading(true);

    if (!validatePassword(formData.password)) {
      toast({
        title: 'Weak Password',
        description: 'Password needs 8+ characters, 1 number and 1 special character',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (userType === 'farmer' && farmerAuthMethod === 'aadhaar') {
      if (!validateAadhaar(formData.aadharNumber) || !formData.dateOfBirth) {
        toast({
          title: 'Missing Information',
          description: 'Please provide valid Aadhaar number and date of birth',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      let email = formData.email;
      let userData: any = {
        name: formData.name,
        user_type: userType
      };

      if (userType === 'farmer' && farmerAuthMethod === 'aadhaar') {
        email = `farmer_${formData.aadharNumber}@internal.local`;
        userData = {
          ...userData,
          aadhar_number: formData.aadharNumber,
          date_of_birth: formData.dateOfBirth
        };
      } else if (userType === 'buyer') {
        userData = {
          ...userData,
          phone: formData.phone,
          whatsapp_number: formData.whatsappNumber
        };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) throw error;

      const successMessage = userType === 'farmer' && farmerAuthMethod === 'aadhaar' 
        ? 'Farmer account created successfully!'
        : 'Account created! Please check your email to verify.';

      toast({
        title: 'Account Created',
        description: successMessage,
      });
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin,
    handleSignup
  };
};