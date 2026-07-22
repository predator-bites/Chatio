import React from 'react';
import { Room } from '../../../service/api.service';
import { Button, Input, Icon } from '../../../components';

interface ChatInviteModalProps {
  isOpen: boolean;
  activeRoom: Room | null;
  isGeneratingInvite: boolean;
  isCopied: boolean;
  onClose: () => void;
  onGenerateInvite: () => void;
  onDeleteInvite: () => void;
  onCopyInvite: () => void;
}

interface ActiveInviteContentProps {
  inviteFullUrl: string;
  isCopied: boolean;
  onCopyInvite: () => void;
  onDeleteInvite: () => void;
}

const ActiveInviteContent: React.FC<ActiveInviteContentProps> = ({
  inviteFullUrl,
  isCopied,
  onCopyInvite,
  onDeleteInvite,
}) => {
  const copyButtonIconSlug = isCopied ? 'check' : 'copy';
  const copyButtonLabel = isCopied ? 'Copied' : 'Copy';

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-primary-500">
        Anyone with this link can join this chat room multiple times.
      </p>
      <div className="flex items-center gap-2">
        <Input
          id="input-invite-url"
          value={inviteFullUrl}
          readOnly
          className="!mb-0 flex-1 font-mono text-xs"
        />
        <Button
          id="btn-copy-invite"
          onClick={onCopyInvite}
          variant="primary"
          size="md"
          className="shrink-0"
        >
          <Icon iconSlug={copyButtonIconSlug} className="w-[16px] h-[16px]" />
          <span>{copyButtonLabel}</span>
        </Button>
      </div>

      <div className="flex justify-end mt-2">
        <Button
          id="btn-delete-invite"
          onClick={onDeleteInvite}
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Icon iconSlug="trash2" className="w-[16px] h-[16px]" />
          <span>Revoke Invite Link</span>
        </Button>
      </div>
    </div>
  );
};

interface NoInviteContentProps {
  isGeneratingInvite: boolean;
  onGenerateInvite: () => void;
}

const NoInviteContent: React.FC<NoInviteContentProps> = ({
  isGeneratingInvite,
  onGenerateInvite,
}) => (
  <div className="flex flex-col gap-4 py-2">
    <p className="text-sm text-primary-600">
      No active invite link for this room. Generate one to share with your
      friends.
    </p>
    <Button
      id="btn-generate-invite"
      onClick={onGenerateInvite}
      isLoading={isGeneratingInvite}
      fullWidth
    >
      Generate Invite Link
    </Button>
  </div>
);

export const ChatInviteModal: React.FC<ChatInviteModalProps> = ({
  isOpen,
  activeRoom,
  isGeneratingInvite,
  isCopied,
  onClose,
  onGenerateInvite,
  onDeleteInvite,
  onCopyInvite,
}) => {
  if (!isOpen || !activeRoom) return null;

  const inviteFullUrl = activeRoom.inviteUrl
    ? `${window.location.origin}/room/join/${activeRoom.id}/${activeRoom.inviteUrl}`
    : '';

  return (
    <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary-800 flex items-center gap-2">
            <Icon
              iconSlug="userPlus"
              className="w-[20px] h-[20px] text-secondary"
            />
            Invite to {activeRoom.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-primary-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <Icon iconSlug="x" className="w-[18px] h-[18px]" />
          </button>
        </div>

        {activeRoom.inviteUrl ? (
          <ActiveInviteContent
            inviteFullUrl={inviteFullUrl}
            isCopied={isCopied}
            onCopyInvite={onCopyInvite}
            onDeleteInvite={onDeleteInvite}
          />
        ) : (
          <NoInviteContent
            isGeneratingInvite={isGeneratingInvite}
            onGenerateInvite={onGenerateInvite}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInviteModal;
