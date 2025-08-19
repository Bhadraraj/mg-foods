import React from 'react';
import SidebarItem from './SidebarItem';

interface SidebarSectionProps {
  title: string;
  items: Array<{
    name: string;
    path?: string;
    icon: React.ReactNode;
    action?: () => void;
    isSpecial?: boolean;
    disabled?: boolean;
  }>;
  isOpen: boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, items, isOpen }) => {
  if (items.length === 0) return null;

  return (
    <div>
      {isOpen && (
        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {title}
        </p>
      )}
      <nav className="space-y-1">
        {items.map((item, index) => (
          <SidebarItem
            key={`${item.name}-${index}`}
            {...item}
            isOpen={isOpen}
          />
        ))}
      </nav>
    </div>
  );
};

export default SidebarSection;