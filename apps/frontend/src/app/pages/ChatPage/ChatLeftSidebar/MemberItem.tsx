import React from 'react';
import { User } from '../../../service/api.service';

interface MemberItemProps {
  member: User;
  isOnline: boolean;
  isCurrentUser: boolean;
}

function calculateHue(username: string): number {
  return username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
}

export const MemberItem: React.FC<MemberItemProps> = ({
  member,
  isOnline,
  isCurrentUser,
}) => {
  const initials = member.username.charAt(0).toUpperCase();
  const hue = calculateHue(member.username);
  const avatarBgColor = `hsl(${hue}, 60%, 55%)`;

  const onlineDotClass = `absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white transition-colors duration-300 ${
    isOnline ? 'bg-emerald-400' : 'bg-primary-300'
  }`;

  const statusTextClass = `text-xs font-medium transition-colors duration-300 ${
    isOnline ? 'text-emerald-500' : 'text-primary-400'
  }`;

  const statusLabel = isOnline ? 'Online' : 'Offline';

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-primary-50 transition-colors group">
      <div className="relative shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white select-none"
          style={{ backgroundColor: avatarBgColor }}
        >
          {initials}
        </div>
        <span className={onlineDotClass} title={statusLabel} />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-primary-800 truncate leading-tight">
          {member.username}
          {isCurrentUser && (
            <span className="ml-1 text-xs text-primary-400 font-normal">
              (you)
            </span>
          )}
        </span>
        <span className={statusTextClass}>{statusLabel}</span>
      </div>
    </div>
  );
};

export default MemberItem;
