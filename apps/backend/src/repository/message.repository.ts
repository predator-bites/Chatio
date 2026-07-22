import { MessageUncheckedCreateInput } from '../../generated/prisma/models';
import prisma from '../db';

const getMessages = () => {
  return prisma.message.findMany();
};

const getRoomMessages = (roomId: string) => {
  return prisma.message.findMany({ where: { roomId } });
};

const create = (data: MessageUncheckedCreateInput) => {
  return prisma.message.create({
    data: {
      ...data,
    },
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
};
