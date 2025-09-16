import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

export default function Auth() {
  const navigate = useNavigate();
  const { isLoading, handleLogin, handleSignup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'buyer' | 'farmer'>('buyer');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const onSubmit = async (formData: any) => {
    if (mode === 'login') {
      await handleLogin(formData, userType);
    } else {
      await handleSignup(formData, userType);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'login' 
              ? 'Welcome back! Please sign in to your account' 
              : 'Join our marketplace to connect farmers and buyers'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={userType} onValueChange={(value) => setUserType(value as 'buyer' | 'farmer')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buyer">Buyer</TabsTrigger>
              <TabsTrigger value="farmer">Farmer</TabsTrigger>
            </TabsList>

            <TabsContent value={userType} className="space-y-4">
              {mode === 'login' ? (
                <LoginForm 
                  userType={userType}
                  isLoading={isLoading}
                  onSubmit={onSubmit}
                />
              ) : (
                <SignupForm 
                  userType={userType}
                  isLoading={isLoading}
                  onSubmit={onSubmit}
                />
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-sm text-primary hover:underline"
                >
                  {mode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}