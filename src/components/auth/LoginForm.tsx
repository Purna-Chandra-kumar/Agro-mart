import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface LoginFormProps {
  userType: 'buyer' | 'farmer';
  isLoading: boolean;
  onSubmit: (formData: any, farmerAuthMethod?: 'email' | 'aadhaar') => void;
}

export default function LoginForm({ userType, isLoading, onSubmit }: LoginFormProps) {
  const [farmerAuthMethod, setFarmerAuthMethod] = useState<'email' | 'aadhaar'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    aadharNumber: '',
    dateOfBirth: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, farmerAuthMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        </>
      )}

      {userType === 'farmer' && (
        <>
          <div className="space-y-3">
            <Label className="text-base font-semibold">Login Method</Label>
            <RadioGroup 
              value={farmerAuthMethod} 
              onValueChange={(value) => setFarmerAuthMethod(value as 'email' | 'aadhaar')}
              className="flex flex-row space-x-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email-method" />
                <Label htmlFor="email-method" className="cursor-pointer">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aadhaar" id="aadhaar-method" />
                <Label htmlFor="aadhaar-method" className="cursor-pointer">Aadhaar</Label>
              </div>
            </RadioGroup>
          </div>

          {farmerAuthMethod === 'email' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="farmer-email">Email</Label>
                <Input
                  id="farmer-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="aadharNumber">Aadhaar Number</Label>
                <Input
                  id="aadharNumber"
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhaar-password">Password</Label>
                <Input
                  id="aadhaar-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
            </>
          )}
        </>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}