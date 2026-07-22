import React from 'react';
import { Room } from '../../../service/api.service';
import { Button, Input, Icon } from '../../../components';

interface ChatFooterProps {
  activeRoom: Room | null;
  messageText: string;
  isSending: boolean;
  onTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export const ChatFooter: React.FC<ChatFooterProps> = ({
  activeRoom,
  messageText,
  isSending,
  onTyping,
  onSendMessage,
}) => {
  if (!activeRoom) return null;

  const isSendDisabled = !messageText.trim() || isSending;

  return (
    <footer className="p-4 bg-white border-t border-primary-200">
      <form
        onSubmit={onSendMessage}
        className="flex items-center gap-3 max-w-4xl mx-auto"
      >
        <div className="flex-1">
          <Input
            id="message-input"
            value={messageText}
            onChange={onTyping}
            placeholder="Type your message..."
            className="!mb-0"
            autoComplete="off"
          />
        </div>
        <Button
          id="btn-send-message"
          type="submit"
          size="md"
          disabled={isSendDisabled}
          className="h-12 px-6 rounded-2xl flex items-center gap-2 shrink-0"
        >
          <Icon iconSlug="send" className="w-[18px] h-[18px]" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </footer>
  );
};

export default ChatFooter;
