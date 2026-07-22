import React from 'react';
import { Logo, Icon } from '../../../components';

interface SidebarHeaderProps {
  onLogout: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onLogout }) => (
  <div className="p-4 border-b border-primary-100 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Logo size={32} />
    </div>
    <button
      onClick={onLogout}
      className="p-2 text-primary-400 hover:text-red-500 transition-colors rounded-full hover:bg-primary-50"
      title="Logout"
    >
      <Icon iconSlug="logOut" className="w-[18px] h-[18px]" />
    </button>
  </div>
);

export default SidebarHeader;
