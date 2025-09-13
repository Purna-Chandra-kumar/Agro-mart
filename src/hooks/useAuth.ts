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
    userType: 'buyer' | 'farmer', 
    farmerAuthMethod?: 'email' | 'aadhaar'
  ) => {
    setIsLoading(true);

    try {
      // For farmer Aadhaar login, validate the Aadhaar number
      if (userType === 'farmer' && farmerAuthMethod === 'aadhaar') {
        if (!formData.aadharNumber || !validateAadhaar(formData.aadharNumber)) {
          toast({
            title: 'Invalid Aadhaar',
            description: 'Please enter a valid 12-digit Aadhaar number',
            variant: 'destructive',
          });
          return;
        }
      }

      // Determine email for login
      let email = formData.email;
      if (userType === 'farmer' && farmerAuthMethod === 'aadhaar') {
        email = `farmer_${formData.aadharNumber}@agro.local`;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
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
    userType: 'buyer' | 'farmer', 
    farmerAuthMethod?: 'email' | 'aadhaar'
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

      // Additional validation for farmer Aadhaar signup
      if (userType === 'farmer' && farmerAuthMethod === 'aadhaar') {
        if (!formData.aadharNumber || !validateAadhaar(formData.aadharNumber)) {
          toast({
            title: 'Invalid Aadhaar',
            description: 'Please enter a valid 12-digit Aadhaar number',
            variant: 'destructive',
          });
          return;
        }

        if (!formData.dateOfBirth) {
          toast({
            title: 'Missing date of birth',
            description: 'Date of birth is required for Aadhaar registration',
            variant: 'destructive',
          });
          return;
        }
      }

      // Prepare email and user metadata
      let email = formData.email;
      let userData: any = {
        name: formData.name,
        user_type: userType
      };

      if (userType === 'farmer' && farmerAuthMethod === 'aadhaar') {
        email = `farmer_${formData.aadharNumber}@agro.local`;
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
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: userData
        }
      });

      if (error) throw error;

      const message = userType === 'farmer' && farmerAuthMethod === 'aadhaar' 
        ? 'Farmer account created successfully!' 
        : 'Account created! Please check your email for verification.';

      toast({
        title: 'Registration successful',
        description: message,
      });

      // For Aadhaar registration, redirect directly to dashboard
      if (userType === 'farmer' && farmerAuthMethod === 'aadhaar') {
        navigate('/farmer-dashboard');
      }
      
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