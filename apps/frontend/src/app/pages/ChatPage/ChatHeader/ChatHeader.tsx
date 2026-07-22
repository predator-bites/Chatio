import React from 'react';
import { Room } from '../../../service/api.service';
import { TypingUser } from '../../../hooks/useRoomMessages';
import { Icon } from '../../../components';
import { TypingIndicator } from './TypingIndicator';

interface ChatHeaderProps {
  activeRoom: Room | null;
  currentUserId: string;
  typingUsers: TypingUser[];
  memberCount?: number;
  isMembersSidebarOpen: boolean;
  onOpenMobileSidebar: () => void;
  onOpenInviteModal: () => void;
  onToggleMembersSidebar: () => void;
}

interface InviteButtonProps {
  onClick: () => void;
}

const InviteButton: React.FC<InviteButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-50 hover:bg-secondary/10 text-secondary font-medium text-xs transition-colors border border-secondary/20"
    title="Invite Users"
  >
    <Icon iconSlug="userPlus" className="w-[16px] h-[16px]" />
    <span className="hidden sm:inline">Invite</span>
  </button>
);

interface MembersToggleButtonProps {
  isOpen: boolean;
  memberCount?: number;
  onToggle: () => void;
}

const MembersToggleButton: React.FC<MembersToggleButtonProps> = ({
  isOpen,
  memberCount,
  onToggle,
}) => {
  const buttonClasses = `flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-xs transition-colors border ${
    isOpen
      ? 'bg-secondary/10 text-secondary border-secondary/30'
      : 'bg-primary-50 hover:bg-secondary/10 text-primary-500 hover:text-secondary border-primary-200 hover:border-secondary/20'
  }`;

  return (
    <button
      onClick={onToggle}
      className={buttonClasses}
      title="Toggle members panel"
    >
      <Icon iconSlug="user" className="w-[16px] h-[16px]" />
      {memberCount !== undefined && (
        <span className="hidden sm:inline">{memberCount}</span>
      )}
    </button>
  );
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  activeRoom,
  currentUserId,
  typingUsers,
  memberCount,
  isMembersSidebarOpen,
  onOpenMobileSidebar,
  onOpenInviteModal,
  onToggleMembersSidebar,
}) => {
  if (!activeRoom) return null;

  const isRoomAdmin =
    activeRoom.id !== 'general' && activeRoom.userId === currentUserId;

  return (
    <header className="h-16 bg-white border-b border-primary-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-primary-500 hover:text-primary-800 p-1"
          onClick={onOpenMobileSidebar}
        >
          <Icon iconSlug="arrowLeft" className="w-[20px] h-[20px]" />
        </button>
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-bold text-primary-800 leading-tight">
            {activeRoom.title}
          </h1>
          <div className="h-4 flex items-center">
            <TypingIndicator typingUsers={typingUsers} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isRoomAdmin && <InviteButton onClick={onOpenInviteModal} />}
        <MembersToggleButton
          isOpen={isMembersSidebarOpen}
          memberCount={memberCount}
          onToggle={onToggleMembersSidebar}
        />
      </div>
    </header>
  );
};

export default ChatHeader;
