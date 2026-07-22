import React, { useEffect, useState } from 'react';
import { Room, User, roomApi } from '../../../service/api.service';
import { Icon } from '../../../components';
import { MemberItem } from './MemberItem';

interface ChatLeftSidebarProps {
  isOpen: boolean;
  activeRoom: Room | null;
  currentUserId: string;
  onlineUserIds: Set<string>;
  onClose: () => void;
}

const MemberSkeleton: React.FC = () => (
  <div className="flex flex-col gap-2 px-2">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-1 py-2 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-primary-100 shrink-0" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-3 bg-primary-100 rounded w-3/4" />
          <div className="h-2 bg-primary-100 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

interface SidebarPanelHeaderProps {
  onClose: () => void;
}

const SidebarPanelHeader: React.FC<SidebarPanelHeaderProps> = ({ onClose }) => (
  <div className="flex items-center justify-between p-4 border-b border-primary-100 shrink-0">
    <div className="flex items-center gap-2">
      <Icon iconSlug="user" className="w-4 h-4 text-primary-400" />
      <h2 className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
        Members
      </h2>
    </div>
    <button
      onClick={onClose}
      className="p-1 text-primary-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
      title="Close panel"
    >
      <Icon iconSlug="x" className="w-4 h-4" />
    </button>
  </div>
);

interface SidebarStatsBarProps {
  onlineCount: number;
  totalCount: number;
}

const SidebarStatsBar: React.FC<SidebarStatsBarProps> = ({
  onlineCount,
  totalCount,
}) => (
  <div className="px-4 py-2 bg-primary-50/60 border-b border-primary-100 shrink-0">
    <p className="text-xs text-primary-500">
      <span className="font-semibold text-emerald-500">
        {onlineCount} online
      </span>
      {' · '}
      {totalCount} total
    </p>
  </div>
);

const GeneralRoomPlaceholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-32 gap-2 text-center px-4">
    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
      <Icon iconSlug="user" className="w-5 h-5 text-primary-300" />
    </div>
    <p className="text-xs text-primary-400 leading-snug">
      General Chat is open to everyone — no member list here.
    </p>
  </div>
);

const EmptyMembersNotice: React.FC = () => (
  <p className="text-xs text-primary-400 italic px-3 py-4">No members found.</p>
);

interface MemberListGroupProps {
  title: string;
  members: User[];
  isOnline: boolean;
  currentUserId: string;
}

const MemberListGroup: React.FC<MemberListGroupProps> = ({
  title,
  members,
  isOnline,
  currentUserId,
}) => {
  if (members.length === 0) return null;

  return (
    <>
      <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-primary-400">
        {title} — {members.length}
      </p>
      {members.map((member) => (
        <MemberItem
          key={member.id}
          member={member}
          isOnline={isOnline}
          isCurrentUser={member.id === currentUserId}
        />
      ))}
    </>
  );
};

function sortMembers(members: User[], onlineUserIds: Set<string>): User[] {
  return [...members].sort((a, b) => {
    const aOnline = onlineUserIds.has(a.id) ? 0 : 1;
    const bOnline = onlineUserIds.has(b.id) ? 0 : 1;

    if (aOnline !== bOnline) return aOnline - bOnline;

    return a.username.localeCompare(b.username);
  });
}

export const ChatLeftSidebar: React.FC<ChatLeftSidebarProps> = ({
  isOpen,
  activeRoom,
  currentUserId,
  onlineUserIds,
  onClose,
}) => {
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeRoom || activeRoom.id === 'general') {
      setMembers([]);
      return;
    }

    let cancelled = false;

    setIsLoading(true);

    roomApi
      .getRoomMembers(activeRoom.id)
      .then((data) => {
        if (!cancelled) setMembers(data);
      })
      .catch(() => {
        if (!cancelled) setMembers([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeRoom]);

  const isGeneralRoom = activeRoom?.id === 'general';
  const sortedMembers = sortMembers(members, onlineUserIds);
  const onlineMembers = sortedMembers.filter((m) => onlineUserIds.has(m.id));
  const offlineMembers = sortedMembers.filter((m) => !onlineUserIds.has(m.id));
  const onlineCount = onlineMembers.length;
  const totalCount = members.length;
  const showStatsBar = !isGeneralRoom && !isLoading && totalCount > 0;

  const asideClasses = `shrink-0 flex flex-col bg-white border-l border-primary-100 transition-all duration-300 ease-in-out overflow-hidden fixed md:relative top-0 right-0 h-full z-30 md:z-auto ${
    isOpen ? 'w-64 shadow-2xl md:shadow-none' : 'w-0 md:w-0'
  }`;

  let contentNode: React.ReactNode;

  if (isGeneralRoom) {
    contentNode = <GeneralRoomPlaceholder />;
  } else if (isLoading) {
    contentNode = <MemberSkeleton />;
  } else if (totalCount === 0) {
    contentNode = <EmptyMembersNotice />;
  } else {
    contentNode = (
      <div className="flex flex-col">
        <MemberListGroup
          title="Online"
          members={onlineMembers}
          isOnline={true}
          currentUserId={currentUserId}
        />
        <MemberListGroup
          title="Offline"
          members={offlineMembers}
          isOnline={false}
          currentUserId={currentUserId}
        />
      </div>
    );
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={asideClasses}>
        <div className="flex flex-col h-full min-w-64">
          <SidebarPanelHeader onClose={onClose} />
          {showStatsBar && (
            <SidebarStatsBar
              onlineCount={onlineCount}
              totalCount={totalCount}
            />
          )}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            {contentNode}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatLeftSidebar;
