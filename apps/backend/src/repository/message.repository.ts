import { MessageUncheckedCreateInput } from '../../generated/prisma/models';
import prisma from '../db';

const WITH_USER = {
  user: {
    select: {
      id: true,
      username: true,
    },
  },
} as const;

const getMessages = () => {
  return prisma.message.findMany({
    include: WITH_USER,
  });
};

const getRoomMessages = (roomId: string) => {
  return prisma.message.findMany({
    where: { roomId },
    include: WITH_USER,
  });
};

const getGeneralRoomMessages = () => {
  return prisma.message.findMany({
    where: { roomId: null },
    include: WITH_USER
  })
}

const create = (data: MessageUncheckedCreateInput) => {
  return prisma.message.create({
    data: {
      ...data,
    },
    include: WITH_USER,
  });
};

const deleteMessage = (messageId: string) => {
  return prisma.message.delete({
    where: {
      id: messageId,
    },
  });
};

const deleteMany = (roomId: string) => {
  return prisma.message.deleteMany({ where: { roomId } });
};

export default {
  getMessages,
  getRoomMessages,
  create,
  deleteMessage,
  deleteMany,
  getGeneralRoomMessages
};
