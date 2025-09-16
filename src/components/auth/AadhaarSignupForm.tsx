import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAadhaarAuth } from '@/hooks/useAadhaarAuth';
import OTPInput from './OTPInput';

interface AadhaarSignupFormProps {
  isLoading: boolean;
}

export default function AadhaarSignupForm({ isLoading }: AadhaarSignupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    aadhaarNumber: '',
    dateOfBirth: '',
    phoneNumber: ''
  });

  const { 
    isLoading: authLoading, 
    step, 
    currentData, 
    handleSignup, 
    handleOTPVerified, 
    handleCancel 
  } = useAadhaarAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignup(formData);
  };

  if (step === 'otp' && currentData?.phoneNumber) {
    return (
      <OTPInput
        phoneNumber={currentData.phoneNumber}
        onVerified={handleOTPVerified}
        onCancel={handleCancel}
        type="signup"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Farmer Registration</h3>
        <p className="text-sm text-muted-foreground">
          Register with your Aadhaar for instant verification
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter your full name as per Aadhaar"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="aadhaar">Aadhaar Number</Label>
        <Input
          id="aadhaar"
          type="text"
          value={formData.aadhaarNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 12);
            setFormData(prev => ({ ...prev, aadhaarNumber: value }));
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
        <p className="text-xs text-muted-foreground">
          Enter your date of birth as per Aadhaar
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Mobile Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, phoneNumber: value }));
          }}
          placeholder="Enter 10-digit mobile number"
          maxLength={10}
          required
        />
        <p className="text-xs text-muted-foreground">
          OTP will be sent to this number
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={
          isLoading || 
          authLoading || 
          !formData.name || 
          formData.aadhaarNumber.length !== 12 || 
          !formData.dateOfBirth || 
          formData.phoneNumber.length !== 10
        }
      >
        {authLoading ? 'Registering...' : 'Register & Send OTP'}
      </Button>
    </form>
  );
}