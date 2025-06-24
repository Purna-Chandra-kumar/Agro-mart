
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, UserCheck, Mail, Lock, CreditCard, Calendar } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  userType: 'buyer' | 'farmer';
  onSuccess: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onSwitchUserType: (type: 'buyer' | 'farmer') => void;
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  mode, 
  userType, 
  onSuccess, 
  onSwitchMode,
  onSwitchUserType 
}: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
    dob: ''
  });
  const [farmerLoginMethod, setFarmerLoginMethod] = useState<'email' | 'aadhaar'>('email');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        toast({ title: "Error", description: "Name is required", variant: "destructive" });
        return false;
      }
      
      if (userType === 'farmer' && farmerLoginMethod === 'aadhaar') {
        if (!/^\d{12}$/.test(formData.aadhaar)) {
          toast({ title: "Error", description: "Valid 12-digit Aadhaar number is required", variant: "destructive" });
          return false;
        }
        if (!formData.dob) {
          toast({ title: "Error", description: "Date of birth is required", variant: "destructive" });
          return false;
        }
      } else {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast({ title: "Error", description: "Valid email is required", variant: "destructive" });
          return false;
        }
        if (formData.password.length < 6) {
          toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
          return false;
        }
      }
    } else {
      if (userType === 'farmer' && farmerLoginMethod === 'aadhaar') {
        if (!/^\d{12}$/.test(formData.aadhaar)) {
          toast({ title: "Error", description: "Valid 12-digit Aadhaar number is required", variant: "destructive" });
          return false;
        }
        if (!formData.dob) {
          toast({ title: "Error", description: "Date of birth is required", variant: "destructive" });
          return false;
        }
      } else {
        if (!formData.email || !formData.password) {
          toast({ title: "Error", description: "Email and password are required", variant: "destructive" });
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({ 
        title: "Success!", 
        description: `${mode === 'login' ? 'Logged in' : 'Signed up'} successfully as ${userType}`,
        className: "bg-green-50 border-green-200"
      });
      onSuccess();
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      aadhaar: '',
      dob: ''
    });
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    onSwitchMode(newMode);
    resetForm();
  };

  const handleUserTypeSwitch = (newType: 'buyer' | 'farmer') => {
    onSwitchUserType(newType);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-800">
            Welcome to Agro Mart
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={userType} onValueChange={(value) => handleUserTypeSwitch(value as 'buyer' | 'farmer')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buyer" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Buyer</span>
            </TabsTrigger>
            <TabsTrigger value="farmer" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Farmer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buyer">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-green-700">
                  {mode === 'login' ? 'Buyer Login' : 'Buyer Signup'}
                </CardTitle>
                <CardDescription>
                  {mode === 'login' 
                    ? 'Sign in to start buying fresh produce'
                    : 'Create account to access fresh vegetables and fruits'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
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
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          className="pl-10"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farmer">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-green-700">
                  {mode === 'login' ? 'Farmer Login' : 'Farmer Signup'}
                </CardTitle>
                <CardDescription>
                  {mode === 'login' 
                    ? 'Sign in to manage your produce listings'
                    : 'Join our farming community'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <Label htmlFor="farmerName">Full Name</Label>
                      <Input
                        id="farmerName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  {mode === 'login' && (
                    <Tabs value={farmerLoginMethod} onValueChange={(value) => setFarmerLoginMethod(value as 'email' | 'aadhaar')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="aadhaar">Aadhaar</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="email" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="farmerEmail">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="farmerEmail"
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="farmerPassword">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="farmerPassword"
                              type="password"
                              placeholder="Enter your password"
                              className="pl-10"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="aadhaar" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="aadhaar">Aadhaar Number</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="aadhaar"
                              type="text"
                              placeholder="Enter 12-digit Aadhaar number"
                              className="pl-10"
                              value={formData.aadhaar}
                              onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                              maxLength={12}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="dob"
                              type="date"
                              className="pl-10"
                              value={formData.dob}
                              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}

                  {mode === 'signup' && (
                    <>
                      <Tabs value={farmerLoginMethod} onValueChange={(value) => setFarmerLoginMethod(value as 'email' | 'aadhaar')}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="email">Email & Password</TabsTrigger>
                          <TabsTrigger value="aadhaar">Aadhaar & DOB</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="email" className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="farmerSignupEmail">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="farmerSignupEmail"
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="farmerSignupPassword">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="farmerSignupPassword"
                                type="password"
                                placeholder="Enter your password"
                                className="pl-10"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="farmerConfirmPassword">Confirm Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="farmerConfirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                className="pl-10"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="aadhaar" className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="farmerAadhaar">Aadhaar Number</Label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="farmerAadhaar"
                                type="text"
                                placeholder="Enter 12-digit Aadhaar number"
                                className="pl-10"
                                value={formData.aadhaar}
                                onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                                maxLength={12}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="farmerDob">Date of Birth</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="farmerDob"
                                type="date"
                                className="pl-10"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-600">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <Button
            variant="link"
            className="p-0 text-green-600 hover:text-green-700"
            onClick={() => handleModeSwitch(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
