
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { userStore } from "@/store/userStore";
import { languageStore } from "@/store/languageStore";

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

  const t = (key: string) => languageStore.translate(key);

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
            {mode === 'login' ? t('auth.welcome') : t('auth.create_account')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? (userType === 'buyer' ? t('auth.signin_buyer') : t('auth.signin_farmer'))
              : (userType === 'buyer' ? t('auth.create_buyer') : t('auth.create_farmer'))
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={userType} onValueChange={(value) => onSwitchUserType(value as 'buyer' | 'farmer')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buyer">{t('auth.buyer')}</TabsTrigger>
            <TabsTrigger value="farmer">{t('auth.farmer')}</TabsTrigger>
          </TabsList>

          <TabsContent value={userType} className="space-y-4">
            {/* Authentication Method Toggle for Farmers */}
            {userType === 'farmer' && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Authentication Method</Label>
                <ToggleGroup 
                  type="single" 
                  value={authMethod} 
                  onValueChange={(value) => value && setAuthMethod(value as 'email' | 'aadhar')}
                  className="grid grid-cols-1 gap-2"
                >
                  <ToggleGroupItem value="email" className="justify-start">
                    {t('auth.method_email')}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="aadhar" className="justify-start">
                    {t('auth.method_aadhar')}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Farmer Name field for signup */}
              {mode === 'signup' && userType === 'farmer' && (
                <div className="space-y-2">
                  <Label htmlFor="farmer-name">{t('auth.farmer_name')}</Label>
                  <Input
                    id="farmer-name"
                    type="text"
                    placeholder={t('auth.enter_farmer_name')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              )}

              {/* Buyer name field for signup */}
              {mode === 'signup' && userType === 'buyer' && (
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.full_name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('auth.enter_name')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              )}

              {/* Phone field for signup */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('common.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t('auth.enter_phone')}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              )}

              {/* Email & Password Method */}
              {(userType === 'buyer' || authMethod === 'email') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('common.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('auth.enter_email')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('common.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('auth.enter_password')}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              {/* Aadhar Method */}
              {userType === 'farmer' && authMethod === 'aadhar' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="aadhar">{t('auth.aadhar_number')}</Label>
                    <Input
                      id="aadhar"
                      type="text"
                      placeholder={t('auth.enter_aadhar')}
                      value={formData.aadharNumber}
                      onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                      maxLength={12}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">{t('auth.date_of_birth')}</Label>
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

              {/* Optional Aadhar fields for farmer signup with email method */}
              {mode === 'signup' && userType === 'farmer' && authMethod === 'email' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="aadhar-signup">{t('auth.aadhar_optional')}</Label>
                    <Input
                      id="aadhar-signup"
                      type="text"
                      placeholder={t('auth.enter_aadhar')}
                      value={formData.aadharNumber}
                      onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                      maxLength={12}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob-signup">{t('auth.dob_optional')}</Label>
                    <Input
                      id="dob-signup"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                </>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('auth.processing') : mode === 'login' ? t('auth.signin') : t('auth.create_account_btn')}
              </Button>
            </form>

            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => {
                  onSwitchMode(mode === 'login' ? 'signup' : 'login');
                  resetForm();
                }}
              >
                {mode === 'login' 
                  ? t('auth.no_account')
                  : t('auth.have_account')
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
