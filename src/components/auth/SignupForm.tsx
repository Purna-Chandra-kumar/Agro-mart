import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SignupFormProps {
  userType: 'buyer' | 'farmer';
  isLoading: boolean;
  onSubmit: (formData: any, farmerAuthMethod?: 'email' | 'aadhaar') => void;
}

const validatePassword = (password: string) => {
  return password.length >= 8 && 
         /\d/.test(password) && 
         /[!@#$%^&*(),.?":{}|<>]/.test(password);
};

export default function SignupForm({ userType, isLoading, onSubmit }: SignupFormProps) {
  const [farmerAuthMethod, setFarmerAuthMethod] = useState<'email' | 'aadhaar'>('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsappNumber: '',
    aadharNumber: '',
    dateOfBirth: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
      alert('Password must be at least 8 characters with 1 number and 1 special character');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    onSubmit(formData, farmerAuthMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters with 1 number and 1 special character
            </p>
          </div>
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
            <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
            />
          </div>
        </>
      )}

      {userType === 'farmer' && (
        <>
          <div className="space-y-3">
            <Label className="text-base font-semibold">Registration Method</Label>
            <RadioGroup 
              value={farmerAuthMethod} 
              onValueChange={(value) => setFarmerAuthMethod(value as 'email' | 'aadhaar')}
              className="flex flex-row space-x-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="signup-email-method" />
                <Label htmlFor="signup-email-method" className="cursor-pointer">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aadhaar" id="signup-aadhaar-method" />
                <Label htmlFor="signup-aadhaar-method" className="cursor-pointer">Aadhaar</Label>
              </div>
            </RadioGroup>
          </div>

          {farmerAuthMethod === 'email' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="farmer-signup-email">Email</Label>
                <Input
                  id="farmer-signup-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmer-signup-password">Password</Label>
                <Input
                  id="farmer-signup-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters with 1 number and 1 special character
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmer-confirm-password">Confirm Password</Label>
                <Input
                  id="farmer-confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="signup-aadharNumber">Aadhaar Number</Label>
                <Input
                  id="signup-aadharNumber"
                  type="text"
                  value={formData.aadharNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setFormData(prev => ({ ...prev, aadharNumber: value }));
                  }}
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength={12}
                  required
                  className="text-center tracking-wider"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your 12-digit Aadhaar number
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-dateOfBirth">Date of Birth</Label>
                <Input
                  id="signup-dateOfBirth"
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
                <Label htmlFor="aadhaar-signup-password">Password</Label>
                <Input
                  id="aadhaar-signup-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters with 1 number and 1 special character
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhaar-confirm-password">Confirm Password</Label>
                <Input
                  id="aadhaar-confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </>
          )}
        </>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}