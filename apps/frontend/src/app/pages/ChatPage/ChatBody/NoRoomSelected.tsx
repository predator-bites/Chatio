import React from 'react';
import { Icon } from '../../../components';

export const NoRoomSelected: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center flex-col text-primary-400 gap-4">
      <Icon iconSlug="messageSquare" className="w-[48px] h-[48px] opacity-50" />
      <p>Select a room to start messaging</p>
    </div>
  );
};

export default NoRoomSelected;
