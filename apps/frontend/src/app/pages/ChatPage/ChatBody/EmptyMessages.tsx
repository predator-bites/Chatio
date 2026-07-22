import React from 'react';

export const EmptyMessages: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center text-primary-400 italic">
      No messages yet. Be the first to say hi!
    </div>
  );
};

export default EmptyMessages;
