import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../../components/forms';
import { COMPANY_INFO } from '../../constants/navigation';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        // Success toast is handled in AuthContext
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Small delay to show the success message
      }
      // Error toast is handled in AuthContext
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-700 py-4">
          <h2 className="text-center text-2xl font-bold text-white">{COMPANY_INFO.name}</h2>
        </div>
        
        <div className="p-6">
          <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
            Login to Dashboard
          </h2>
          
          <LoginForm onSubmit={handleSubmit} loading={loading} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-700 hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
          
          {/* Optional: Forgot password link */}
          <div className="mt-2 text-center">
            <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-blue-700">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;