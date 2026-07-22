import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import messageRepository from '../repository/message.repository';
import roomRepository from '../repository/room.repository';
import userRepository from '../repository/user.repository';
import ApiError from '../utils/ApiError';
import { MessageUncheckedCreateInput } from '../../generated/prisma/models';
import { getIO } from '../socket';

const getMessages = async (req: ExpressRequest, res: ExpressResponse) => {
  const messages = await messageRepository.getMessages();

  if (!messages) {
    throw ApiError.internalServerError();
  }

  res.status(200).send(messages);
};

const create = async (req: ExpressRequest, res: ExpressResponse) => {
  const { userId, text, roomId } = req.body;

  if (!userId || !text) {
    throw ApiError.badRequest('UserId and text is required');
  }

  const user = await userRepository.getById(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const rawMessage: MessageUncheckedCreateInput = { userId, text };

  if (roomId) {
    if (!(await roomRepository.getById(roomId))) {
      throw ApiError.notFound('Room not found');
    }

    rawMessage['roomId'] = roomId;
  }

  const message = await messageRepository.create(rawMessage);

  if (!message) {
    throw ApiError.internalServerError();
  }

  const targetRoom = roomId ?? 'general';

  getIO().to(targetRoom).emit('new_message', message);

  res.status(201).send(message);
};

const deleteMessage = async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.body;

  if (!id) {
    throw ApiError.badRequest('Bad request, id not found');
  }

  const deletedMessage = await messageRepository.deleteMessage(id);

  if (!deletedMessage) {
    throw ApiError.notFound('Message not found');
  }

  const targetRoom = deletedMessage.roomId ?? 'general';

  getIO().to(targetRoom).emit('message_delete', deletedMessage);

  res.sendStatus(204);
};

export default {
  getMessages,
  create,
  deleteMessage,
};
