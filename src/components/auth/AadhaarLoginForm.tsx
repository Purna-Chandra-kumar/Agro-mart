import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAadhaarAuth } from '@/hooks/useAadhaarAuth';
import OTPInput from './OTPInput';

interface AadhaarLoginFormProps {
  isLoading: boolean;
}

export default function AadhaarLoginForm({ isLoading }: AadhaarLoginFormProps) {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const { 
    isLoading: authLoading, 
    step, 
    currentData, 
    handleLogin, 
    handleOTPVerified, 
    handleCancel 
  } = useAadhaarAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin({ aadhaarNumber });
  };

  if (step === 'otp' && currentData?.phoneNumber) {
    return (
      <OTPInput
        phoneNumber={currentData.phoneNumber}
        onVerified={handleOTPVerified}
        onCancel={handleCancel}
        type="login"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Farmer Login</h3>
        <p className="text-sm text-muted-foreground">
          Enter your Aadhaar number to receive OTP
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="aadhaar">Aadhaar Number</Label>
        <Input
          id="aadhaar"
          type="text"
          value={aadhaarNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 12);
            setAadhaarNumber(value);
          }}
          placeholder="Enter 12-digit Aadhaar number"
          maxLength={12}
          required
          className="text-center tracking-wider text-lg"
        />
        <p className="text-xs text-muted-foreground">
          OTP will be sent to your registered mobile number
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || authLoading || aadhaarNumber.length !== 12}
      >
        {authLoading ? 'Sending OTP...' : 'Send OTP'}
      </Button>
    </form>
  );
}