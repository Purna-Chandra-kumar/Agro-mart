import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAadhaarAuth } from '@/hooks/useAadhaarAuth';
import { useAuth } from '@/hooks/useAuth';
import VoiceInput from './VoiceInput';
import OTPInput from './OTPInput';

interface FarmerAuthFormProps {
  mode: 'login' | 'signup';
  isLoading: boolean;
}

export default function FarmerAuthForm({ mode, isLoading }: FarmerAuthFormProps) {
  const [authMethod, setAuthMethod] = useState<'aadhaar' | 'email'>('aadhaar');
  const [language, setLanguage] = useState('en');
  
  // Aadhaar form data
  const [aadhaarData, setAadhaarData] = useState({
    name: '',
    aadhaarNumber: '',
    dateOfBirth: '',
    phoneNumber: ''
  });

  // Email form data
  const [emailData, setEmailData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { 
    isLoading: aadhaarLoading, 
    step, 
    currentData, 
    handleLogin: aadhaarLogin, 
    handleSignup: aadhaarSignup,
    handleOTPVerified, 
    handleCancel 
  } = useAadhaarAuth();

  const { handleLogin: emailLogin, handleSignup: emailSignup } = useAuth();

  const handleMethodChange = (method: 'aadhaar' | 'email') => {
    setAuthMethod(method);
    // Clear forms when switching
    setAadhaarData({ name: '', aadhaarNumber: '', dateOfBirth: '', phoneNumber: '' });
    setEmailData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      aadhaarLogin({ aadhaarNumber: aadhaarData.aadhaarNumber });
    } else {
      aadhaarSignup(aadhaarData);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await emailLogin(emailData, 'farmer');
    } else {
      await emailSignup(emailData, 'farmer');
    }
  };

  // Show OTP input if in OTP step
  if (authMethod === 'aadhaar' && step === 'otp' && currentData?.phoneNumber) {
    return (
      <OTPInput
        phoneNumber={currentData.phoneNumber}
        onVerified={handleOTPVerified}
        onCancel={handleCancel}
        type={mode}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="space-y-2">
        <Label>Language / भाषा / భాష</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Auth Method Toggle */}
      <div className="space-y-3">
        <Label>Authentication Method</Label>
        <RadioGroup
          value={authMethod}
          onValueChange={(value) => handleMethodChange(value as 'aadhaar' | 'email')}
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="aadhaar" id="aadhaar-method" />
            <Label htmlFor="aadhaar-method">Aadhaar Login/Signup</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email-method" />
            <Label htmlFor="email-method">Email Login/Signup</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Aadhaar Form */}
      {authMethod === 'aadhaar' && (
        <form onSubmit={handleAadhaarSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">
              {mode === 'login' ? 'Farmer Login' : 'Farmer Registration'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' 
                ? 'Enter your Aadhaar number to receive OTP'
                : 'Register with your Aadhaar for instant verification'
              }
            </p>
          </div>

          {mode === 'signup' && (
            <VoiceInput
              id="name"
              label="Full Name"
              value={aadhaarData.name}
              onChange={(value) => setAadhaarData(prev => ({ ...prev, name: value }))}
              placeholder="Enter your full name as per Aadhaar"
              required
              language={language}
            />
          )}

          <VoiceInput
            id="aadhaar"
            label="Aadhaar Number"
            value={aadhaarData.aadhaarNumber}
            onChange={(value) => {
              const numericValue = value.replace(/\D/g, '').slice(0, 12);
              setAadhaarData(prev => ({ ...prev, aadhaarNumber: numericValue }));
            }}
            placeholder="Enter 12-digit Aadhaar number"
            maxLength={12}
            required
            className="text-center tracking-wider"
            language={language}
          />

          {mode === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="flex gap-2">
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={aadhaarData.dateOfBirth}
                    onChange={(e) => setAadhaarData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      // Voice input for date would need special handling
                      // For now, just show a tip
                      alert('Please use the date picker or type manually for date of birth');
                    }}
                    className="shrink-0"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <circle cx="12" cy="19" r="3"/>
                    </svg>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your date of birth as per Aadhaar
                </p>
              </div>

              <VoiceInput
                id="phone"
                label="Mobile Number"
                type="tel"
                value={aadhaarData.phoneNumber}
                onChange={(value) => {
                  const numericValue = value.replace(/\D/g, '').slice(0, 10);
                  setAadhaarData(prev => ({ ...prev, phoneNumber: numericValue }));
                }}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                required
                language={language}
              />
            </>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={
              isLoading || 
              aadhaarLoading || 
              aadhaarData.aadhaarNumber.length !== 12 ||
              (mode === 'signup' && (!aadhaarData.name || !aadhaarData.dateOfBirth || aadhaarData.phoneNumber.length !== 10))
            }
          >
            {aadhaarLoading 
              ? (mode === 'login' ? 'Sending OTP...' : 'Registering...') 
              : (mode === 'login' ? 'Send OTP' : 'Register & Send OTP')
            }
          </Button>
        </form>
      )}

      {/* Email Form */}
      {authMethod === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">
              {mode === 'login' ? 'Email Login' : 'Email Registration'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' 
                ? 'Sign in with your email and password'
                : 'Create an account with email and password'
              }
            </p>
          </div>

          {mode === 'signup' && (
            <VoiceInput
              id="email-name"
              label="Full Name"
              value={emailData.name}
              onChange={(value) => setEmailData(prev => ({ ...prev, name: value }))}
              placeholder="Enter your full name"
              required
              language={language}
            />
          )}

          <VoiceInput
            id="email"
            label="Email Address"
            type="email"
            value={emailData.email}
            onChange={(value) => setEmailData(prev => ({ ...prev, email: value }))}
            placeholder="Enter your email address"
            required
            language={language}
          />

          <VoiceInput
            id="password"
            label="Password"
            type="password"
            value={emailData.password}
            onChange={(value) => setEmailData(prev => ({ ...prev, password: value }))}
            placeholder="Enter your password"
            required
            language={language}
          />

          {mode === 'signup' && (
            <VoiceInput
              id="confirm-password"
              label="Confirm Password"
              type="password"
              value={emailData.confirmPassword}
              onChange={(value) => setEmailData(prev => ({ ...prev, confirmPassword: value }))}
              placeholder="Confirm your password"
              required
              language={language}
            />
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={
              isLoading || 
              !emailData.email || 
              !emailData.password ||
              (mode === 'signup' && (!emailData.name || !emailData.confirmPassword))
            }
          >
            {isLoading 
              ? (mode === 'login' ? 'Signing in...' : 'Creating Account...') 
              : (mode === 'login' ? 'Sign In' : 'Create Account')
            }
          </Button>
        </form>
      )}
    </div>
  );
}