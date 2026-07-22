import React from 'react';
import { TypingUser } from '../../../hooks/useRoomMessages';

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsers,
}) => {
  if (typingUsers.length === 0) return;

  return (
    <span className="text-xs text-secondary font-medium flex items-center gap-1.5">
      <span className="flex gap-0.5 items-center">
        <span
          className="w-1 h-1 bg-secondary rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1 h-1 bg-secondary rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1 h-1 bg-secondary rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </span>
      {typingUsers.map((u) => u.username || 'Someone').join(', ')}{' '}
      {typingUsers.length > 1 ? 'are' : 'is'} typing...
    </span>
  );
};

export default TypingIndicator;
