import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AadhaarLoginForm from './AadhaarLoginForm';

interface LoginFormProps {
  userType: 'buyer' | 'farmer';
  isLoading: boolean;
  onSubmit: (formData: any) => void;
}

export default function LoginForm({ userType, isLoading, onSubmit }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        <AadhaarLoginForm isLoading={isLoading} />
      )}

      {userType === 'buyer' && (
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      )}
    </form>
  );
}