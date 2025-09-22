import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { supabaseUserStore } from '@/store/supabaseUserStore';
import { validateAadhaar, validatePassword } from '@/utils/validation';

interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
  whatsappNumber?: string;
  aadharNumber?: string;
  dateOfBirth?: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (
    formData: FormData, 
    userType: 'buyer' | 'farmer'
  ) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Get user session and profile
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await supabaseUserStore.getProfile(session.user.id);
        
        toast({
          title: 'Welcome back!',
          description: 'Login successful',
        });

        // Navigate based on user type
        if (profile?.user_type === 'farmer') {
          navigate('/farmer-dashboard');
        } else if (profile?.user_type === 'buyer') {
          navigate('/buyer-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (
    formData: FormData, 
    userType: 'buyer' | 'farmer'
  ) => {
    setIsLoading(true);

    try {
      // Validate password strength
      if (!validatePassword(formData.password)) {
        toast({
          title: 'Password too weak',
          description: 'Password must be at least 8 characters with 1 number and 1 special character',
          variant: 'destructive',
        });
        return;
      }

      // Check password confirmation
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: 'Password mismatch',
          description: 'Password and confirmation do not match',
          variant: 'destructive',
        });
        return;
      }

      // Prepare user metadata
      const userData = {
        name: formData.name,
        user_type: userType,
        phone: formData.phone,
        whatsapp_number: formData.whatsappNumber
      };

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: userData
        }
      });

      if (error) throw error;

      const message = 'Account created! Please check your email for verification.';

      toast({
        title: 'Registration successful',
        description: message,
      });
      
    } catch (error: any) {
      toast({
        title: 'Registration failed',
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