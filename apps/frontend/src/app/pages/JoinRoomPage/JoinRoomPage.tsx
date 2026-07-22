import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi } from '../../service/api.service';
import { useToast } from '../../hooks/useToast';
import {
  Button,
  Loader,
  Icon,
  Logo,
  DecorativeBlobs,
  Header,
} from '../../components';

export const JoinRoomPage: React.FC = () => {
  const { roomId, inviteUrl } = useParams<{
    roomId: string;
    inviteUrl: string;
  }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [roomInfo, setRoomInfo] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('chatio_user');

    if (!storedUser) {
      showToast('Please sign in to join the room', 'error');
      navigate('/login');
      return;
    }

    if (!roomId || !inviteUrl) {
      showToast('Invalid invite link', 'error');
      navigate('/chat');
      return;
    }

    const fetchRoomInfo = async () => {
      setIsLoadingInfo(true);
      try {
        const info = await roomApi.getRoomInfoByInvite(roomId, inviteUrl);

        setRoomInfo(info);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Invalid invite link';

        showToast(msg, 'error');
        navigate('/chat');
      } finally {
        setIsLoadingInfo(false);
      }
    };

    fetchRoomInfo();
  }, [roomId, inviteUrl, navigate, showToast]);

  const handleJoin = async () => {
    try {
      if (!roomId || !inviteUrl) return;

      setIsJoining(true);
      await roomApi.join(roomId, inviteUrl);

      showToast('Successfully joined the room!', 'success');
      navigate('/chat');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to join room';

      if (msg.toLowerCase().includes('already')) {
        showToast('You are already a member of this room', 'success');
        navigate('/chat');
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoadingInfo) {
    return (
      <div className="min-h-screen w-full bg-primary-50 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo size={64} />
          <Loader size="lg" />
          <p className="text-sm font-medium text-primary-600">
            Loading invite information...
          </p>
        </div>
      </div>
    );
  }

  if (!roomInfo) return null;

  return (
    <div className="min-h-screen w-full bg-primary-50 flex flex-col items-center justify-between px-5 pt-14 pb-10 overflow-hidden relative">
      <DecorativeBlobs />

      <Header />

      <main className="w-full max-w-sm flex flex-col items-center gap-6 bg-white p-8 rounded-3xl border border-primary-100 shadow-xl z-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
          <Icon iconSlug="userPlus" className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
            You've been invited to join
          </span>
          <h1 className="text-2xl font-bold text-primary-800 leading-tight">
            {roomInfo.title}
          </h1>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <Button
            id="btn-join-room"
            onClick={handleJoin}
            isLoading={isJoining}
            size="lg"
            fullWidth
          >
            Join Room
          </Button>
          <Button
            id="btn-cancel-join"
            variant="ghost"
            onClick={() => navigate('/chat')}
            disabled={isJoining}
            size="md"
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </main>

      <footer className="text-sm text-primary-700/50 text-center">
        Logged in to Chatio
      </footer>
    </div>
  );
};

export default JoinRoomPage;
