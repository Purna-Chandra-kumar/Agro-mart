import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { languageStore } from '@/store/languageStore';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'buyer' | 'farmer'>('buyer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    aadharNumber: '',
    dateOfBirth: '',
    whatsappNumber: ''
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Password confirmation validation for signup
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Aadhaar validation for farmers
    if (userType === 'farmer' && formData.aadharNumber.length !== 12) {
      toast({
        title: 'Error',
        description: 'Aadhaar number must be exactly 12 digits',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        if (userType === 'farmer') {
          // For farmers, use Aadhaar + DOB + Password to find and authenticate
          // Since Supabase auth requires email, we'll need to find the user by Aadhaar first
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('aadhar_number', formData.aadharNumber)
            .eq('date_of_birth', formData.dateOfBirth)
            .eq('user_type', 'farmer')
            .single();

          if (profileError || !profiles) {
            throw new Error('Invalid Aadhaar number or date of birth');
          }

          // Get the user's email from auth.users to perform login
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profiles.user_id);
          
          if (userError || !userData.user?.email) {
            throw new Error('User not found');
          }

          const { error } = await supabase.auth.signInWithPassword({
            email: userData.user.email,
            password: formData.password,
          });

          if (error) throw new Error('Invalid Aadhaar number or password');
        } else {
          // Buyer login with email
          const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (error) throw error;
        }

        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });

        navigate('/dashboard');
      } else {
        // Signup
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        if (userType === 'farmer') {
          // For farmer signup, we still need an email for Supabase auth
          // We'll use aadhaar@farmer.local as a placeholder
          const farmerEmail = `${formData.aadharNumber}@farmer.local`;
          
          const { error } = await supabase.auth.signUp({
            email: farmerEmail,
            password: formData.password,
            options: {
              emailRedirectTo: redirectUrl,
              data: {
                name: formData.name,
                user_type: userType,
                aadhar_number: formData.aadharNumber,
                date_of_birth: formData.dateOfBirth
              }
            }
          });

          if (error) throw error;

          toast({
            title: 'Account Created',
            description: 'Your farmer account has been created successfully!',
          });
        } else {
          // Buyer signup with email
          const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              emailRedirectTo: redirectUrl,
              data: {
                name: formData.name,
                user_type: userType,
                phone: formData.phone,
                whatsapp_number: formData.whatsappNumber
              }
            }
          });

          if (error) throw error;

          toast({
            title: 'Account Created',
            description: 'Please check your email to verify your account.',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      aadharNumber: '',
      dateOfBirth: '',
      whatsappNumber: ''
    });
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    resetForm();
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                )}

                {/* Buyer Authentication Fields */}
                {userType === 'buyer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    {mode === 'signup' && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Farmer Authentication Fields - Aadhaar Only */}
                {userType === 'farmer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="aadhar">Aadhaar Number (12 digits)</Label>
                      <Input
                        id="aadhar"
                        type="text"
                        maxLength={12}
                        pattern="[0-9]{12}"
                        value={formData.aadharNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData(prev => ({ ...prev, aadharNumber: value }));
                        }}
                        placeholder="Enter 12-digit Aadhaar number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    {mode === 'signup' && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Additional Signup Fields */}
                {mode === 'signup' && userType === 'buyer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                </Button>
              </form>

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