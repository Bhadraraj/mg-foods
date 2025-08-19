// components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'pulse' | 'dots' | 'ripple' | 'orbit';
  className?: string;
  color?: 'blue' | 'purple' | 'green' | 'pink' | 'orange' | 'indigo';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'pulse',
  className = '',
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const colorClasses = {
    blue: {
      primary: 'border-blue-500',
      secondary: 'border-blue-200',
      gradient: 'from-blue-400 to-blue-600',
      bg: 'bg-blue-500',
      dot: 'bg-blue-500'
    },
    purple: {
      primary: 'border-purple-500',
      secondary: 'border-purple-200',
      gradient: 'from-purple-400 to-purple-600',
      bg: 'bg-purple-500',
      dot: 'bg-purple-500'
    },
    green: {
      primary: 'border-green-500',
      secondary: 'border-green-200',
      gradient: 'from-green-400 to-green-600',
      bg: 'bg-green-500',
      dot: 'bg-green-500'
    },
    pink: {
      primary: 'border-pink-500',
      secondary: 'border-pink-200',
      gradient: 'from-pink-400 to-pink-600',
      bg: 'bg-pink-500',
      dot: 'bg-pink-500'
    },
    orange: {
      primary: 'border-orange-500',
      secondary: 'border-orange-200',
      gradient: 'from-orange-400 to-orange-600',
      bg: 'bg-orange-500',
      dot: 'bg-orange-500'
    },
    indigo: {
      primary: 'border-indigo-500',
      secondary: 'border-indigo-200',
      gradient: 'from-indigo-400 to-indigo-600',
      bg: 'bg-indigo-500',
      dot: 'bg-indigo-500'
    }
  };

  const colors = colorClasses[color];

  const renderSpinner = () => {
    switch (variant) {
      case 'gradient':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors.gradient} opacity-75 animate-spin`}></div>
            <div className={`absolute inset-1 rounded-full bg-white`}></div>
            <div className={`absolute inset-2 rounded-full bg-gradient-to-r ${colors.gradient} animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className={`absolute inset-0 rounded-full ${colors.bg} animate-ping opacity-75`}></div>
            <div className={`absolute inset-0 rounded-full ${colors.bg} animate-pulse opacity-50`}></div>
            <div className={`relative rounded-full ${colors.bg} ${sizeClasses[size]} flex items-center justify-center`}>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            </div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={`w-3 h-3 ${colors.dot} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-3 h-3 ${colors.dot} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-3 h-3 ${colors.dot} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      
      case 'ripple':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className={`absolute inset-0 rounded-full border-4 ${colors.primary} opacity-75 animate-ping`}></div>
            <div className={`absolute inset-2 rounded-full border-4 ${colors.primary} opacity-50 animate-ping`} style={{ animationDelay: '0.5s' }}></div>
            <div className={`absolute inset-4 rounded-full border-4 ${colors.primary} opacity-25 animate-ping`} style={{ animationDelay: '1s' }}></div>
          </div>
        );
      
      case 'orbit':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className={`absolute inset-0 rounded-full border-2 ${colors.secondary}`}></div>
            <div className={`absolute top-0 left-1/2 w-3 h-3 ${colors.bg} rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin`} style={{ transformOrigin: '50% 200%' }}></div>
            <div className={`absolute top-1/2 right-0 w-2 h-2 ${colors.bg} rounded-full transform translate-x-1/2 -translate-y-1/2 animate-spin opacity-60`} style={{ transformOrigin: '-100% 50%', animationDelay: '0.5s' }}></div>
          </div>
        );
      
      default:
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className={`absolute inset-0 rounded-full border-4 ${colors.secondary}`}></div>
            <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-4 ${colors.primary} animate-spin`}></div>
            <div className={`absolute inset-2 rounded-full border-2 border-transparent border-t-2 ${colors.primary} animate-spin opacity-60`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
        );
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderSpinner()}
    </div>
  );
};

export default LoadingSpinner;