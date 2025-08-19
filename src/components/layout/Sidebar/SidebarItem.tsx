import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

interface SidebarItemProps {
  name: string;
  path?: string;
  icon: React.ReactNode;
  action?: () => void;
  isSpecial?: boolean;
  isOpen: boolean;
  disabled?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  path,
  icon,
  action,
  isSpecial = false,
  isOpen,
  disabled = false,
}) => {
  const location = useLocation();

  const baseClasses = "w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 text-left";
  
  if (isSpecial && action) {
    return (
      <button
        onClick={action}
        disabled={disabled}
        className={clsx(
          baseClasses,
          disabled
            ? "text-gray-400 bg-gray-50 cursor-not-allowed"
            : "text-red-600 hover:text-red-700 hover:bg-red-50"
        )}
      >
        <span className="mr-3 flex-shrink-0">{icon}</span>
        {isOpen && <span className="truncate">{name}</span>}
      </button>
    );
  }

  if (!path) return null;

  return (
    <Link
      to={path}
      className={clsx(
        baseClasses,
        location.pathname === path
          ? "text-blue-700 bg-blue-50 border-r-2 border-blue-700"
          : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
      )}
    >
      <span className="mr-3 flex-shrink-0">{icon}</span>
      {isOpen && <span className="truncate">{name}</span>}
    </Link>
  );
};

export default SidebarItem;