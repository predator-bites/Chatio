import React from 'react';
import { User } from '../../../service/api.service';

interface SidebarUserProfileProps {
  user: User;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  user,
}) => {
  const userInitial = user.username.charAt(0).toUpperCase();

  return (
    <div className="p-4 border-t border-primary-100 bg-primary-50/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
          {userInitial}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-primary-800">
            {user.username}
          </span>
          <span className="text-xs text-primary-500 truncate">
            {user.email}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
