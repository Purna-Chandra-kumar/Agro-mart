import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { languageStore } from '@/store/languageStore';
import { supabaseUserStore } from '@/store/supabaseUserStore';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'buyer' | 'farmer'>('buyer');
  const [farmerAuthMethod, setFarmerAuthMethod] = useState<'email' | 'aadhaar'>('email');
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
    // Check if user is already logged in when page loads
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Already logged in, redirect to dashboard
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  // Simple validation functions
  const validateAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar); // Just check if it's 12 digits
  };

  const validatePassword = (password) => {
    // Password should have at least 8 chars, 1 number, 1 special char
    return password.length >= 8 && 
           /\d/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate farmer aadhaar stuff
    if (userType === 'farmer' && farmerAuthMethod === 'aadhaar') {
      if (!validateAadhaar(formData.aadharNumber)) {
        toast({
          title: 'Oops!',
          description: 'Aadhaar number should be exactly 12 digits',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      if (!formData.dateOfBirth) {
        toast({
          title: 'Missing Info',
          description: 'Please enter your date of birth',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    }

    // Make sure passwords match during signup
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'The passwords you entered don\'t match',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Check if password is strong enough
    if (mode === 'signup' && !validatePassword(formData.password)) {
      toast({
        title: 'Weak Password',
        description: 'Password needs 8+ characters, 1 number and 1 special character',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        if (userType === 'farmer') {
          if (farmerAuthMethod === 'aadhaar') {
            const generatedEmail = `farmer_${formData.aadharNumber}@internal.local`;
            
            const { error } = await supabase.auth.signInWithPassword({
              email: generatedEmail,
              password: formData.password,
            });

            if (error) throw new Error('Invalid Aadhaar number, date of birth or password');
          } else {
            const { error } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password,
            });

            if (error) throw error;
          }
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (error) throw error;
        }

        // Redirect to appropriate dashboard
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await supabaseUserStore.getProfile(session.user.id);
          
          toast({
            title: 'Login Successful',
            description: 'Welcome back!',
          });

          // Route to correct dashboard
          if (profile?.user_type === 'farmer') {
            navigate('/farmer-dashboard');
          } else {
            navigate('/buyer-dashboard');
          }
        } else {
          navigate('/dashboard');
        }
      } else {
        // Create new account
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        if (userType === 'farmer') {
          if (farmerAuthMethod === 'aadhaar') {
            const generatedEmail = `farmer_${formData.aadharNumber}@internal.local`;
            
            const { error } = await supabase.auth.signUp({
              email: generatedEmail,
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
            const { error } = await supabase.auth.signUp({
              email: formData.email,
              password: formData.password,
              options: {
                emailRedirectTo: redirectUrl,
                data: {
                  name: formData.name,
                  user_type: userType
                }
              }
            });

            if (error) throw error;
            
            toast({
              title: 'Account Created',
              description: 'Please check your email to verify your account.',
            });
          }
        } else {
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
                        minLength={8}
                      />
                      {mode === 'signup' && (
                        <p className="text-xs text-muted-foreground">
                          Minimum 8 characters with 1 number and 1 special character
                        </p>
                      )}
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

                {/* Farmer Authentication Method Toggle */}
                {userType === 'farmer' && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Select Login Method</Label>
                      <RadioGroup 
                        value={farmerAuthMethod} 
                        onValueChange={(value) => setFarmerAuthMethod(value as 'email' | 'aadhaar')}
                        className="flex flex-row space-x-8"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email-method" />
                          <Label htmlFor="email-method" className="cursor-pointer">Email Login</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="aadhaar" id="aadhaar-method" />
                          <Label htmlFor="aadhaar-method" className="cursor-pointer">Aadhaar Login</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Email Method Fields */}
                    {farmerAuthMethod === 'email' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="farmer-email">Email Address</Label>
                          <Input
                            id="farmer-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="farmer-password">Password</Label>
                          <Input
                            id="farmer-password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Enter your password"
                            required
                            minLength={8}
                          />
                          {mode === 'signup' && (
                            <p className="text-xs text-muted-foreground">
                              Minimum 8 characters with 1 number and 1 special character
                            </p>
                          )}
                        </div>
                        {mode === 'signup' && (
                          <div className="space-y-2">
                            <Label htmlFor="farmer-confirm-password">Confirm Password</Label>
                            <Input
                              id="farmer-confirm-password"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              placeholder="Confirm your password"
                              required
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Aadhaar Method Fields */}
                    {farmerAuthMethod === 'aadhaar' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="aadharNumber">Aadhaar Number</Label>
                          <Input
                            id="aadharNumber"
                            type="text"
                            value={formData.aadharNumber}
                            onChange={(e) => {
                              // Only allow digits and limit to 12 characters
                              const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                              setFormData(prev => ({ ...prev, aadharNumber: value }));
                            }}
                            placeholder="Enter 12-digit Aadhaar number"
                            maxLength={12}
                            required
                            className="text-center tracking-wider"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter your 12-digit Aadhaar number (digits only)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            required
                            max={new Date().toISOString().split('T')[0]}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter your date of birth as per Aadhaar
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aadhaar-password">Password</Label>
                          <Input
                            id="aadhaar-password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Create a strong password"
                            required
                            minLength={8}
                          />
                          {mode === 'signup' && (
                            <p className="text-xs text-muted-foreground">
                              Minimum 8 characters with 1 number and 1 special character
                            </p>
                          )}
                        </div>
                        {mode === 'signup' && (
                          <div className="space-y-2">
                            <Label htmlFor="aadhaar-confirm-password">Confirm Password</Label>
                            <Input
                              id="aadhaar-confirm-password"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              placeholder="Confirm your password"
                              required
                            />
                          </div>
                        )}
                      </>
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