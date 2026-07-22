import React from 'react';
import { Message } from '../../../service/api.service';

interface MessageViewModel {
  msg: Message;
  isMe: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  senderName: string;
  avatarHue: number;
  formattedTime: string;
}

function toHue(str: string): number {
  return str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildViewModels(
  messages: Message[],
  currentUserId: string,
  usersMap: Map<string, string>,
): MessageViewModel[] {
  return messages.map((msg, index) => {
    const isMe = msg.userId === currentUserId;
    const prevMsg = messages[index - 1];
    const nextMsg = messages[index + 1];

    return {
      msg,
      isMe,
      isFirstInGroup: !prevMsg || prevMsg.userId !== msg.userId,
      isLastInGroup: !nextMsg || nextMsg.userId !== msg.userId,
      senderName: isMe
        ? 'You'
        : (msg.user?.username ?? usersMap.get(msg.userId) ?? 'Unknown'),
      avatarHue: toHue(msg.userId),
      formattedTime: formatTime(msg.createdAt),
    };
  });
}

interface SenderLabelProps {
  senderName: string;
  avatarHue: number;
}

const SenderLabel: React.FC<SenderLabelProps> = ({ senderName, avatarHue }) => (
  <div className="flex items-center gap-2 mb-1 ml-1">
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
      style={{ backgroundColor: `hsl(${avatarHue}, 60%, 55%)` }}
    >
      {senderName.charAt(0).toUpperCase()}
    </div>
    <span className="text-xs font-semibold text-primary-500">{senderName}</span>
  </div>
);

interface MessageBubbleProps {
  text: string;
  isMe: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isMe }) => (
  <div className={`flex max-w-[70%] ${isMe ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`rounded-2xl px-5 py-3 shadow-sm ${
        isMe
          ? 'bg-secondary text-white rounded-br-sm'
          : 'bg-white border border-primary-100 text-primary-800 rounded-bl-sm'
      }`}
    >
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  </div>
);

interface TimestampProps {
  time: string;
  isMe: boolean;
}

const Timestamp: React.FC<TimestampProps> = ({ time, isMe }) => (
  <span
    className={`text-[10px] text-primary-400 mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}
  >
    {time}
  </span>
);

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  usersMap: Map<string, string>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  usersMap,
}) => {
  const viewModels = buildViewModels(messages, currentUserId, usersMap);

  return (
    <>
      {viewModels.map(
        ({
          msg,
          isMe,
          isFirstInGroup,
          isLastInGroup,
          senderName,
          avatarHue,
          formattedTime,
        }) => (
          <div
            key={msg.id}
            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isFirstInGroup ? 'mt-4' : 'mt-1'}`}
          >
            {isFirstInGroup && !isMe && (
              <SenderLabel senderName={senderName} avatarHue={avatarHue} />
            )}

            <MessageBubble text={msg.text} isMe={isMe} />

            {isLastInGroup && <Timestamp time={formattedTime} isMe={isMe} />}
          </div>
        ),
      )}
    </>
  );
};

export default MessageList;
