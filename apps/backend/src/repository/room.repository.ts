import prisma from '../db';

const WITH_MEMBERS = {
  members: {
    include: { user: true },
  },
} as const;

const getById = (id: string) => {
  return prisma.room.findFirst({
    where: { id },
    include: WITH_MEMBERS,
  });
};

const get = () => {
  return prisma.room.findMany({ include: WITH_MEMBERS });
};

const getUserRooms = (userId: string) => {
  return prisma.room.findMany({
    where: { members: { some: { userId } } },
    include: WITH_MEMBERS,
    orderBy: { createdAt: 'desc' },
  });
};

const getRoomWithMessages = (roomId: string) => {
  return prisma.room.findFirst({
    where: { id: roomId },
    include: { ...WITH_MEMBERS, messages: true },
  });
};

const create = (data: { title: string; userId: string }) => {
  return prisma.room.create({
    data: {
      title: data.title,
      userId: data.userId,
      members: {
        create: { userId: data.userId },
      },
    },
    include: WITH_MEMBERS,
  });
};

const deleteRoom = (roomId: string) => {
  return prisma.room.delete({ where: { id: roomId } });
};

const change = (
  roomId: string,
  toChange: { title?: string; inviteUrl?: string | null },
) => {
  return prisma.room.update({
    where: { id: roomId },
    data: toChange,
    include: WITH_MEMBERS,
  });
};

const addMember = (roomId: string, userId: string) => {
  return prisma.roomMember.create({
    data: { roomId, userId },
    include: { user: true },
  });
};

const removeMember = (roomId: string, userId: string) => {
  return prisma.roomMember.delete({
    where: { roomId_userId: { roomId, userId } },
  });
};

const isMember = async (roomId: string, userId: string): Promise<boolean> => {
  const row = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
  });

  return row !== null;
};

export default {
  get,
  getById,
  create,
  deleteRoom,
  change,
  getRoomWithMessages,
  getUserRooms,
  addMember,
  removeMember,
  isMember,
};
