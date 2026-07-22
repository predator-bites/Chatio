import React from 'react';
import { Room, User } from '../../../service/api.service';
import { SidebarHeader } from './SidebarHeader';
import { SidebarRoomList } from './SidebarRoomList';
import { SidebarUserProfile } from './SidebarUserProfile';

interface ChatSidebarProps {
  isMobileSidebarOpen: boolean;
  user: User;
  rooms: Room[];
  activeRoom: Room | null;
  isLoadingRooms: boolean;
  isCreatingRoom: boolean;
  newRoomTitle: string;
  isCreating: boolean;
  onLogout: () => void;
  onToggleCreatingRoom: () => void;
  onNewRoomTitleChange: (value: string) => void;
  onCreateRoom: (e: React.FormEvent) => void;
  onSelectRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string, e: React.MouseEvent) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isMobileSidebarOpen,
  user,
  rooms,
  activeRoom,
  isLoadingRooms,
  isCreatingRoom,
  newRoomTitle,
  isCreating,
  onLogout,
  onToggleCreatingRoom,
  onNewRoomTitleChange,
  onCreateRoom,
  onSelectRoom,
  onDeleteRoom,
}) => {
  const sidebarClasses = `${
    isMobileSidebarOpen ? 'flex' : 'hidden'
  } md:flex w-full md:w-80 bg-white border-r border-primary-200 flex-col shrink-0`;

  return (
    <aside className={sidebarClasses}>
      <SidebarHeader onLogout={onLogout} />

      <SidebarRoomList
        rooms={rooms}
        activeRoom={activeRoom}
        currentUserId={user.id}
        isLoadingRooms={isLoadingRooms}
        isCreatingRoom={isCreatingRoom}
        newRoomTitle={newRoomTitle}
        isCreating={isCreating}
        onToggleCreatingRoom={onToggleCreatingRoom}
        onNewRoomTitleChange={onNewRoomTitleChange}
        onCreateRoom={onCreateRoom}
        onSelectRoom={onSelectRoom}
        onDeleteRoom={onDeleteRoom}
      />

      <SidebarUserProfile user={user} />
    </aside>
  );
};

export default ChatSidebar;
