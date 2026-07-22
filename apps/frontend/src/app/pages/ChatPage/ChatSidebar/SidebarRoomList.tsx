import React from 'react';
import { Room } from '../../../service/api.service';
import { Icon, Loader } from '../../../components';
import { CreateRoomForm } from './CreateRoomForm';
import { Rooms } from './Rooms';

interface SidebarRoomListProps {
  rooms: Room[];
  activeRoom: Room | null;
  currentUserId: string;
  isLoadingRooms: boolean;
  isCreatingRoom: boolean;
  newRoomTitle: string;
  isCreating: boolean;
  onToggleCreatingRoom: () => void;
  onNewRoomTitleChange: (value: string) => void;
  onCreateRoom: (e: React.FormEvent) => void;
  onSelectRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string, e: React.MouseEvent) => void;
}

const LoadingRoomsIndicator: React.FC = () => (
  <div className="flex justify-center p-4 text-primary-400">
    <Loader size="md" />
  </div>
);

const EmptyRoomsNotice: React.FC = () => (
  <p className="text-sm text-primary-400 px-2 italic">No rooms yet.</p>
);

export const SidebarRoomList: React.FC<SidebarRoomListProps> = ({
  rooms,
  activeRoom,
  currentUserId,
  isLoadingRooms,
  isCreatingRoom,
  newRoomTitle,
  isCreating,
  onToggleCreatingRoom,
  onNewRoomTitleChange,
  onCreateRoom,
  onSelectRoom,
  onDeleteRoom,
}) => {
  let roomContentNode: React.ReactNode;

  if (isLoadingRooms) {
    roomContentNode = <LoadingRoomsIndicator />;
  } else if (rooms.length === 0) {
    roomContentNode = <EmptyRoomsNotice />;
  } else {
    roomContentNode = (
      <Rooms
        rooms={rooms}
        activeRoom={activeRoom}
        currentUserId={currentUserId}
        onSelectRoom={onSelectRoom}
        onDeleteRoom={onDeleteRoom}
      />
    );
  }

  const toggleIconSlug = isCreatingRoom ? 'x' : 'plus';

  return (
    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
          Your Rooms
        </h2>
        <button
          onClick={onToggleCreatingRoom}
          className="text-primary-400 hover:text-secondary transition-colors"
          title="Create Room"
        >
          <Icon iconSlug={toggleIconSlug} className="w-[16px] h-[16px]" />
        </button>
      </div>

      {isCreatingRoom && (
        <CreateRoomForm
          newRoomTitle={newRoomTitle}
          isCreating={isCreating}
          onNewRoomTitleChange={onNewRoomTitleChange}
          onCreateRoom={onCreateRoom}
        />
      )}

      {roomContentNode}
    </div>
  );
};

export default SidebarRoomList;
