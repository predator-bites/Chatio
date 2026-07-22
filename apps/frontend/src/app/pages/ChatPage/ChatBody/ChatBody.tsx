import React from 'react';
import { Room, Message } from '../../../service/api.service';
import { NoRoomSelected } from './NoRoomSelected';
import { LoadingMessages } from './LoadingMessages';
import { EmptyMessages } from './EmptyMessages';
import { MessageList } from './MessageList';

interface ChatBodyProps {
  activeRoom: Room | null;
  isLoadingMessages: boolean;
  messages: Message[];
  currentUserId: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

function buildUsersMap(
  users?: { id: string; username: string }[],
): Map<string, string> {
  return new Map<string, string>((users ?? []).map((u) => [u.id, u.username]));
}

function resolveChatBodyContent(
  activeRoom: Room | null,
  isLoadingMessages: boolean,
  messages: Message[],
  currentUserId: string,
  usersMap: Map<string, string>,
): React.ReactNode {
  if (!activeRoom) {
    return <NoRoomSelected />;
  }

  if (isLoadingMessages) {
    return <LoadingMessages />;
  }

  if (messages.length === 0) {
    return <EmptyMessages />;
  }

  return (
    <MessageList
      messages={messages}
      currentUserId={currentUserId}
      usersMap={usersMap}
    />
  );
}

export const ChatBody: React.FC<ChatBodyProps> = ({
  activeRoom,
  isLoadingMessages,
  messages,
  currentUserId,
  messagesEndRef,
}) => {
  const usersMap = buildUsersMap(activeRoom?.users);
  const content = resolveChatBodyContent(
    activeRoom,
    isLoadingMessages,
    messages,
    currentUserId,
    usersMap,
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-primary-50 to-white flex flex-col gap-4">
      {content}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBody;
