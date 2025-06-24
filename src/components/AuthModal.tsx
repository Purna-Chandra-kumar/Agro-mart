
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Lock, User, Calendar, CreditCard, UserCheck, Sprout } from "lucide-react";
import { userStore } from "@/store/userStore";
import { languageStore } from "@/store/languageStore";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  userType: 'buyer' | 'farmer';
  onSuccess: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onSwitchUserType: (type: 'buyer' | 'farmer') => void;
}

const AuthModal = ({
  isOpen,
  onClose,
  mode,
  userType,
  onSuccess,
  onSwitchMode,
  onSwitchUserType
}: AuthModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    aadhaar: '',
    dob: ''
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    aadhaar: '',
    dob: ''
  });
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'aadhaar'>('email');
  const [signupMethod, setSignupMethod] = useState<'email' | 'aadhaar'>('email');

  const handleLogin = async () => {
    setLoading(true);
    
    try {
      let email = loginData.email;
      
      // For Aadhaar login, we need to find the email associated with the Aadhaar
      if (userType === 'farmer' && loginMethod === 'aadhaar') {
        if (!loginData.aadhaar || !loginData.dob) {
          toast({
            title: "Please fill all fields",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        // In a real app, you'd look up the email by Aadhaar
        email = 'farmer@test.com'; // Mock lookup
      }
      
      const result = userStore.login(email, loginData.password);
      
      if (result.success) {
        toast({
          title: "Login successful!",
          description: "Welcome back to Agro Mart",
          className: "bg-green-50 border-green-200"
        });
        onSuccess();
      } else {
        toast({
          title: "Login failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    
    try {
      // Validation
      if (!signupData.name || !signupData.email) {
        toast({
          title: "Please fill all required fields",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      if (signupMethod === 'email') {
        if (!signupData.password || signupData.password !== signupData.confirmPassword) {
          toast({
            title: "Passwords don't match",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      } else {
        if (!signupData.aadhaar || !signupData.dob) {
          toast({
            title: "Please provide Aadhaar and Date of Birth",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        if (signupData.aadhaar.length !== 12) {
          toast({
            title: "Aadhaar must be 12 digits",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }
      
      const result = userStore.signup({
        name: signupData.name,
        email: signupData.email,
        type: userType,
        phone: signupData.phone
      });
      
      if (result.success) {
        // Auto-verify for demo (in real app, send verification email)
        userStore.verifyEmail(signupData.email);
        
        toast({
          title: "Account created successfully!",
          description: "You can now log in to your account",
          className: "bg-green-50 border-green-200"
        });
        
        // Switch to login mode
        onSwitchMode('login');
        
        // Clear form
        setSignupData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          aadhaar: '',
          dob: ''
        });
      } else {
        toast({
          title: "Signup failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Signup error", 
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {userType === 'buyer' ? <User className="h-5 w-5" /> : <Sprout className="h-5 w-5" />}
            <span>
              {mode === 'login' ? languageStore.translate('auth.login') : languageStore.translate('auth.signup')} as {userType === 'buyer' ? 'Buyer' : 'Farmer'}
            </span>
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? `Sign in to your ${userType} account`
              : `Create a new ${userType} account`
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={userType} onValueChange={(value) => onSwitchUserType(value as 'buyer' | 'farmer')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buyer" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Buyer</span>
            </TabsTrigger>
            <TabsTrigger value="farmer" className="flex items-center space-x-2">
              <Sprout className="h-4 w-4" />
              <span>Farmer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buyer" className="space-y-4">
            {mode === 'login' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer-email">{languageStore.translate('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="buyer-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-password">{languageStore.translate('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="buyer-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer-signup-name">Full Name</Label>
                  <Input
                    id="buyer-signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-signup-email">{languageStore.translate('auth.email')}</Label>
                  <Input
                    id="buyer-signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-signup-phone">Phone Number</Label>
                  <Input
                    id="buyer-signup-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-signup-password">{languageStore.translate('auth.password')}</Label>
                  <Input
                    id="buyer-signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-signup-confirm">Confirm Password</Label>
                  <Input
                    id="buyer-signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="farmer" className="space-y-4">
            {mode === 'login' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Login Method</Label>
                  <Select value={loginMethod} onValueChange={(value: 'email' | 'aadhaar') => setLoginMethod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email & Password</SelectItem>
                      <SelectItem value="aadhaar">Aadhaar & Date of Birth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {loginMethod === 'email' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-email">{languageStore.translate('auth.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="farmer-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-password">{languageStore.translate('auth.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="farmer-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-aadhaar">Aadhaar Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="farmer-aadhaar"
                          type="text"
                          placeholder="Enter 12-digit Aadhaar number"
                          className="pl-10"
                          maxLength={12}
                          value={loginData.aadhaar}
                          onChange={(e) => setLoginData({ ...loginData, aadhaar: e.target.value.replace(/\D/g, '') })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-dob">Date of Birth</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="farmer-dob"
                          type="date"
                          className="pl-10"
                          value={loginData.dob}
                          onChange={(e) => setLoginData({ ...loginData, dob: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Signup Method</Label>
                  <Select value={signupMethod} onValueChange={(value: 'email' | 'aadhaar') => setSignupMethod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email & Password</SelectItem>
                      <SelectItem value="aadhaar">Aadhaar & Date of Birth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmer-signup-name">Full Name</Label>
                  <Input
                    id="farmer-signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  />
                </div>

                {signupMethod === 'email' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-signup-email">{languageStore.translate('auth.email')}</Label>
                      <Input
                        id="farmer-signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-signup-phone">Phone Number</Label>
                      <Input
                        id="farmer-signup-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-signup-password">{languageStore.translate('auth.password')}</Label>
                      <Input
                        id="farmer-signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-signup-confirm">Confirm Password</Label>
                      <Input
                        id="farmer-signup-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-signup-email-aadhaar">Email (for notifications)</Label>
                      <Input
                        id="farmer-signup-email-aadhaar"
                        type="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-signup-aadhaar">Aadhaar Number</Label>
                      <Input
                        id="farmer-signup-aadhaar"
                        type="text"
                        placeholder="Enter 12-digit Aadhaar number"
                        maxLength={12}
                        value={signupData.aadhaar}
                        onChange={(e) => setSignupData({ ...signupData, aadhaar: e.target.value.replace(/\D/g, '') })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-signup-dob">Date of Birth</Label>
                      <Input
                        id="farmer-signup-dob"
                        type="date"
                        value={signupData.dob}
                        onChange={(e) => setSignupData({ ...signupData, dob: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-signup-phone-aadhaar">Phone Number</Label>
                      <Input
                        id="farmer-signup-phone-aadhaar"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <Button 
            onClick={mode === 'login' ? handleLogin : handleSignup}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Processing..." : (mode === 'login' ? languageStore.translate('auth.login') : languageStore.translate('auth.signup'))}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              {mode === 'login' ? languageStore.translate('auth.signup') : languageStore.translate('auth.login')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
