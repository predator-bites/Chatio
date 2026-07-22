import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  roomApi,
  messageApi,
  authApi,
  Room,
  User,
} from '../../service/api.service';
import { useRoomMessages } from '../../hooks/useRoomMessages';
import { useToast } from '../../hooks/useToast';
import { useOnlineUsers } from '../../hooks/useOnlineUsers';
import { Loader } from '../../components';
import { ChatHeader } from './ChatHeader/ChatHeader';
import { ChatBody } from './ChatBody/ChatBody';
import { ChatInviteModal } from './ChatBody/ChatInviteModal';
import { ChatSidebar } from './ChatSidebar/ChatSidebar';
import { ChatFooter } from './ChatFooter/ChatFooter';
import { ChatLeftSidebar } from './ChatLeftSidebar/ChatLeftSidebar';

const GENERAL_ROOM: Room = {
  id: 'general',
  title: 'General Chat',
  userId: 'system',
  users: [],
  inviteUrl: null,
  createdAt: '',
};

const SessionLoader: React.FC = () => (
  <div className="flex h-screen w-full bg-primary-50 items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-primary-400">
      <Loader size="lg" />
      <p className="text-sm font-medium">Loading session...</p>
    </div>
  </div>
);

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([GENERAL_ROOM]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(GENERAL_ROOM);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isMembersSidebarOpen, setIsMembersSidebarOpen] = useState(false);

  const onlineUserIds = useOnlineUsers(user?.id ?? null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleReconnect = useCallback(async () => {
    if (!activeRoom || !user) return;

    try {
      const updatedRooms = await roomApi.getUserRooms();
      setRooms([GENERAL_ROOM, ...updatedRooms]);

      const data =
        activeRoom.id === 'general'
          ? await messageApi.getGeneralRoomMessages()
          : await roomApi.getMessages(activeRoom.id);

      setMessages(data);
      showToast('Reconnected to chat server', 'success');
    } catch {
      // silent catch during reconnect
    }
  }, [activeRoom, user, setMessages, showToast]);

  const { messages, setMessages, typingUsers, sendTyping, connected } =
    useRoomMessages(
      activeRoom?.id || null,
      user?.id || null,
      user?.username || null,
      handleReconnect,
    );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('chatio_user');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const loggedInUser = await authApi.currentUser();

        if (!loggedInUser) {
          navigate('/login');
          return;
        }

        setUser(loggedInUser);
        localStorage.setItem('chatio_user', JSON.stringify(loggedInUser));
      } catch {
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchRooms = async () => {
      try {
        setIsLoadingRooms(true);
        const data = await roomApi.getUserRooms();

        setRooms([GENERAL_ROOM, ...data]);
      } catch {
        showToast('Failed to fetch rooms', 'error');
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [user, showToast]);

  useEffect(() => {
    if (!activeRoom) return;

    setMessages([]);
    setIsLoadingMessages(true);

    const loadMessages = async () => {
      try {
        const data =
          activeRoom.id === 'general'
            ? await messageApi.getGeneralRoomMessages()
            : await roomApi.getMessages(activeRoom.id);

        setMessages(data);
      } catch {
        showToast('Failed to load messages', 'error');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeRoom, setMessages, showToast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateActiveRoomInvite = useCallback(
    (inviteUrl: string | null) => {
      if (!activeRoom) return;

      const updatedRoom = { ...activeRoom, inviteUrl };

      setActiveRoom(updatedRoom);
      setRooms((prev) =>
        prev.map((r) => (r.id === activeRoom.id ? updatedRoom : r)),
      );
    },
    [activeRoom],
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const text = messageText.trim();

      if (!text || !activeRoom || !user) return;

      setIsSending(true);

      const roomId = activeRoom.id === 'general' ? undefined : activeRoom.id;

      await messageApi.create({ roomId, userId: user.id, text });

      setMessageText('');
    } catch {
      showToast('Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    sendTyping();
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const title = newRoomTitle.trim();

      if (!title) return;

      setIsCreating(true);

      const newRoom = await roomApi.create({ title });

      setRooms((prev) => [newRoom, ...prev]);
      setActiveRoom(newRoom);
      setNewRoomTitle('');
      setIsCreatingRoom(false);

      showToast('Room created successfully', 'success');
    } catch {
      showToast('Failed to create room', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateInvite = async () => {
    try {
      if (!activeRoom) return;

      setIsGeneratingInvite(true);

      const inviteUrl = await roomApi.generateInviteUrl({
        roomId: activeRoom.id,
      });

      updateActiveRoomInvite(inviteUrl);

      showToast('Invite link generated successfully!', 'success');
    } catch {
      showToast('Failed to generate invite link', 'error');
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const handleDeleteInvite = async () => {
    try {
      if (!activeRoom) return;

      await roomApi.deleteInviteUrl({ roomId: activeRoom.id });

      updateActiveRoomInvite(null);

      showToast('Invite link revoked', 'success');
    } catch {
      showToast('Failed to revoke invite link', 'error');
    }
  };

  const handleCopyInvite = async () => {
    try {
      if (!activeRoom?.inviteUrl) return;

      const fullUrl = `${window.location.origin}/room/join/${activeRoom.id}/${activeRoom.inviteUrl}`;

      await navigator.clipboard.writeText(fullUrl);

      setIsCopied(true);

      showToast('Invite link copied to clipboard!', 'success');

      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast('Failed to copy invite link', 'error');
    }
  };

  const handleDeleteRoom = async (roomId: string, e: React.MouseEvent) => {
    try {
      e.stopPropagation();

      if (roomId === 'general') return;

      await roomApi.delete(roomId);

      setRooms((prev) => prev.filter((r) => r.id !== roomId));

      if (activeRoom?.id === roomId) {
        setActiveRoom(GENERAL_ROOM);
      }

      showToast('Room deleted successfully', 'success');
    } catch {
      showToast('Failed to delete room', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();

      localStorage.removeItem('chatio_user');

      navigate('/login');
    } catch {
      showToast('Logout failed', 'error');
    }
  };

  const handleToggleCreatingRoom = useCallback(() => {
    setIsCreatingRoom((prev) => !prev);
  }, []);

  const handleSelectRoom = useCallback((room: Room) => {
    setActiveRoom(room);
    setIsMobileSidebarOpen(false);
  }, []);

  const handleOpenMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const handleOpenInviteModal = useCallback(() => {
    setShowInviteModal(true);
  }, []);

  const handleCloseInviteModal = useCallback(() => {
    setShowInviteModal(false);
  }, []);

  const handleToggleMembersSidebar = useCallback(() => {
    setIsMembersSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseMembersSidebar = useCallback(() => {
    setIsMembersSidebarOpen(false);
  }, []);

  if (!user) {
    return <SessionLoader />;
  }

  const mainClassName = `${
    !isMobileSidebarOpen ? 'flex' : 'hidden'
  } md:flex flex-1 flex-col relative w-full`;

  const memberCount =
    activeRoom?.id !== 'general' ? activeRoom?.users?.length : undefined;

  return (
    <div className="flex h-screen w-full bg-primary-50 overflow-hidden">
      <ChatSidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        user={user}
        rooms={rooms}
        activeRoom={activeRoom}
        isLoadingRooms={isLoadingRooms}
        isCreatingRoom={isCreatingRoom}
        newRoomTitle={newRoomTitle}
        isCreating={isCreating}
        onLogout={handleLogout}
        onToggleCreatingRoom={handleToggleCreatingRoom}
        onNewRoomTitleChange={setNewRoomTitle}
        onCreateRoom={handleCreateRoom}
        onSelectRoom={handleSelectRoom}
        onDeleteRoom={handleDeleteRoom}
      />

      <main className={mainClassName}>
        {!connected && (
          <div className="bg-amber-500 text-white text-xs font-semibold text-center py-1.5 px-3 tracking-wide shrink-0 animate-pulse">
            Connecting to chat server...
          </div>
        )}
        <ChatHeader
          activeRoom={activeRoom}
          currentUserId={user.id}
          typingUsers={typingUsers}
          memberCount={memberCount}
          isMembersSidebarOpen={isMembersSidebarOpen}
          onOpenMobileSidebar={handleOpenMobileSidebar}
          onOpenInviteModal={handleOpenInviteModal}
          onToggleMembersSidebar={handleToggleMembersSidebar}
        />

        <ChatBody
          activeRoom={activeRoom}
          isLoadingMessages={isLoadingMessages}
          messages={messages}
          currentUserId={user.id}
          messagesEndRef={messagesEndRef}
        />

        <ChatFooter
          activeRoom={activeRoom}
          messageText={messageText}
          isSending={isSending}
          onTyping={handleTyping}
          onSendMessage={handleSendMessage}
        />
      </main>

      <ChatLeftSidebar
        isOpen={isMembersSidebarOpen}
        activeRoom={activeRoom}
        currentUserId={user.id}
        onlineUserIds={onlineUserIds}
        onClose={handleCloseMembersSidebar}
      />

      <ChatInviteModal
        isOpen={showInviteModal}
        activeRoom={activeRoom}
        isGeneratingInvite={isGeneratingInvite}
        isCopied={isCopied}
        onClose={handleCloseInviteModal}
        onGenerateInvite={handleGenerateInvite}
        onDeleteInvite={handleDeleteInvite}
        onCopyInvite={handleCopyInvite}
      />
    </div>
  );
};

export default ChatPage;
