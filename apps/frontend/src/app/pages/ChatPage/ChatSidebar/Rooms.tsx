import React from 'react';
import { Room } from '../../../service/api.service';
import { Icon } from '../../../components';

interface RoomItemProps {
  room: Room;
  isActive: boolean;
  isOwner: boolean;
  onSelect: (room: Room) => void;
  onDelete: (roomId: string, e: React.MouseEvent) => void;
}

const RoomItem: React.FC<RoomItemProps> = ({
  room,
  isActive,
  isOwner,
  onSelect,
  onDelete,
}) => {
  const containerClasses = `group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
    isActive
      ? 'bg-secondary text-white shadow-md'
      : 'hover:bg-primary-50 text-primary-700'
  }`;

  const iconBoxClasses = `p-2 rounded-lg shrink-0 ${isActive ? 'bg-white/20' : 'bg-primary-100'}`;

  const deleteButtonClasses = `p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
    isActive
      ? 'hover:bg-white/20 text-white'
      : 'hover:bg-red-50 text-primary-400 hover:text-red-500'
  }`;

  const handleSelect = () => onSelect(room);
  const handleDeleteClick = (e: React.MouseEvent) => onDelete(room.id, e);

  return (
    <div onClick={handleSelect} className={containerClasses}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={iconBoxClasses}>
          <Icon iconSlug="messageSquare" className="w-[18px] h-[18px]" />
        </div>
        <span className="font-medium truncate">{room.title}</span>
      </div>

      {isOwner && (
        <button
          onClick={handleDeleteClick}
          className={deleteButtonClasses}
          title="Delete Room"
        >
          <Icon iconSlug="trash2" className="w-[16px] h-[16px]" />
        </button>
      )}
    </div>
  );
};

interface RoomsProps {
  rooms: Room[];
  activeRoom: Room | null;
  currentUserId: string;
  onSelectRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string, e: React.MouseEvent) => void;
}

export const Rooms: React.FC<RoomsProps> = ({
  rooms,
  activeRoom,
  currentUserId,
  onSelectRoom,
  onDeleteRoom,
}) => {
  return (
    <>
      {rooms.map((room) => {
        const isActive = activeRoom?.id === room.id;
        const isOwner = room.id !== 'general' && room.userId === currentUserId;

        return (
          <RoomItem
            key={room.id}
            room={room}
            isActive={isActive}
            isOwner={isOwner}
            onSelect={onSelectRoom}
            onDelete={onDeleteRoom}
          />
        );
      })}
    </>
  );
};

export default Rooms;
