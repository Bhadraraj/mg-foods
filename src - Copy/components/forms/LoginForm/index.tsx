import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '../../ui';
import { validateEmail } from '../../../utils/validation';
import { useApiIntegration } from '../../hooks/useApiIntegration';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { executeWithFeedback } = useApiIntegration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      await executeWithFeedback(
        () => onSubmit(email, password),
        'Login successful!',
        'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        disabled={loading}
        error={errors.email}
        required
      />
      
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={loading}
          error={errors.password}
          required
        />
        <button
          type="button"
          className="absolute right-3 top-8 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
          disabled={loading}
        >
          {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
        </button>
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        loading={loading}
        className="w-full"
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;