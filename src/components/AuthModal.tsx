
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { userStore } from "@/store/userStore";

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
  const [authMethod, setAuthMethod] = useState<'email' | 'aadhar'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    aadharNumber: '',
    dateOfBirth: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        let result;
        if (userType === 'farmer' && authMethod === 'aadhar') {
          result = userStore.loginWithAadhar(formData.aadharNumber, formData.dateOfBirth);
        } else {
          result = userStore.login(formData.email, formData.password);
        }
        
        if (result.success) {
          toast({
            title: "Login successful!",
            description: "Welcome back!",
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
      } else {
        const userData = {
          email: formData.email,
          name: formData.name,
          type: userType,
          phone: formData.phone,
          ...(userType === 'farmer' && authMethod === 'aadhar' && {
            aadharNumber: formData.aadharNumber,
            dateOfBirth: formData.dateOfBirth
          })
        };
        
        const result = userStore.signup(userData);
        
        if (result.success) {
          userStore.verifyEmail(formData.email);
          
          toast({
            title: "Account created successfully!",
            description: "You can now log in.",
            className: "bg-green-50 border-green-200"
          });
          onSwitchMode('login');
        } else {
          toast({
            title: "Signup failed",
            description: result.message,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      aadharNumber: '',
      dateOfBirth: ''
    });
    setAuthMethod('email');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
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
            <TabsTrigger value="buyer">Buyer</TabsTrigger>
            <TabsTrigger value="farmer">Farmer</TabsTrigger>
          </TabsList>

          <TabsContent value={userType} className="space-y-4">
            {userType === 'farmer' && mode === 'login' && (
              <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as 'email' | 'aadhar')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="aadhar">Aadhar</TabsTrigger>
                </TabsList>

                <TabsContent value={authMethod}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {authMethod === 'email' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="aadhar">Aadhar Number</Label>
                          <Input
                            id="aadhar"
                            type="text"
                            placeholder="Enter your 12-digit Aadhar number"
                            value={formData.aadharNumber}
                            onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                            maxLength={12}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}

            {(userType === 'buyer' || mode === 'signup') && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    {userType === 'farmer' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="aadhar-signup">Aadhar Number (Optional)</Label>
                          <Input
                            id="aadhar-signup"
                            type="text"
                            placeholder="Enter your 12-digit Aadhar number"
                            value={formData.aadharNumber}
                            onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                            maxLength={12}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob-signup">Date of Birth (Optional)</Label>
                          <Input
                            id="dob-signup"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
            )}

            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => {
                  onSwitchMode(mode === 'login' ? 'signup' : 'login');
                  resetForm();
                }}
              >
                {mode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
