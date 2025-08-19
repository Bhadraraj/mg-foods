import React from 'react';
import { User } from '../../../types';

interface UserInfoProps {
  user: User;
  isOpen: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="ml-3 min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name || 'User'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;