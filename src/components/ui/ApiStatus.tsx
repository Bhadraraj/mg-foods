import React from 'react';
import { AlertCircle, CheckCircle, Loader2, WifiOff } from 'lucide-react';
import { ApiError } from '../../services/api/base';

interface ApiStatusProps {
  loading?: boolean;
  error?: ApiError | null;
  success?: boolean;
  className?: string;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ 
  loading = false, 
  error = null, 
  success = false, 
  className = '' 
}) => {
  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-blue-600 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (error) {
    const isNetworkError = error.code === 'NETWORK_ERROR';
    
    return (
      <div className={`flex items-center gap-2 text-red-600 ${className}`}>
        {isNetworkError ? (
          <WifiOff className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <span className="text-sm">
          {isNetworkError ? 'Connection failed' : error.message}
        </span>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">Success</span>
      </div>
    );
  }

  return null;
};

export default ApiStatus;