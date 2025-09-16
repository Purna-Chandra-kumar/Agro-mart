import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OTPInputProps {
  phoneNumber: string;
  onVerified: () => void;
  onCancel: () => void;
  type: 'signup' | 'login';
}

export default function OTPInput({ phoneNumber, onVerified, onCancel, type }: OTPInputProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phoneNumber, otp }
      });

      if (error) throw error;

      if (data.verified) {
        toast({
          title: 'Success',
          description: 'Phone number verified successfully',
        });
        onVerified();
      } else {
        throw new Error(data.error || 'Invalid OTP');
      }
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid or expired OTP',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber, type }
      });

      if (error) throw error;

      toast({
        title: 'OTP Sent',
        description: 'A new OTP has been sent to your phone',
      });

      setTimeLeft(300); // Reset timer
      setOtp(''); // Clear current OTP
    } catch (error: any) {
      toast({
        title: 'Resend Failed',
        description: error.message || 'Failed to send OTP',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Verify Phone Number</h3>
        <p className="text-muted-foreground">
          Enter the 6-digit code sent to {phoneNumber}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <Label>Enter OTP</Label>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            className="justify-center"
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-muted-foreground">
              Code expires in {formatTime(timeLeft)}
            </p>
          ) : (
            <p className="text-sm text-destructive">
              OTP has expired
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
            className="w-full"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <Button
            variant="outline"
            onClick={handleResendOTP}
            disabled={isResending || timeLeft > 240} // Allow resend after 1 minute
            className="w-full"
          >
            {isResending ? 'Sending...' : 'Resend OTP'}
          </Button>

          <Button
            variant="ghost"
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}