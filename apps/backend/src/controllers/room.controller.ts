import 'dotenv';

import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import roomRepository from '../repository/room.repository';
import ApiError from '../utils/ApiError';
import { getIO } from '../socket';
import bcrypt from 'bcrypt';
import sanitiseUser from '../utils/sanitise';

function formatRoom(room: Awaited<ReturnType<typeof roomRepository.getById>>) {
  if (!room) return null;

  const { members, ...rest } = room;

  return {
    ...rest,
    users: members.map((m) => sanitiseUser(m.user)),
    userIds: members.map((m) => m.userId),
  };
}

const create = async (req: ExpressRequest, res: ExpressResponse) => {
  const { title } = req.body;

  if (!title?.trim()) {
    throw ApiError.badRequest('Title is required');
  }

  const room = await roomRepository.create({ title, userId: req.user.id });

  if (!room) {
    throw ApiError.internalServerError();
  }

  res.status(201).send(formatRoom(room));
};

const getUserRooms = async (req: ExpressRequest, res: ExpressResponse) => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Permission denied');
  }

  const rooms = await roomRepository.getUserRooms(req.user.id);

  res.status(200).send(rooms.map(formatRoom));
};

const deleteRoom = async (req: ExpressRequest, res: ExpressResponse) => {
  const { roomId } = req.params;

  if (!roomId || typeof roomId !== 'string') {
    throw ApiError.badRequest('Room id is required');
  }

  const room = await roomRepository.getById(roomId);

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (room.userId !== req.user.id) {
    throw ApiError.unauthorized('Permission denied');
  }

  await roomRepository.deleteRoom(roomId);

  getIO().emit('room_deleted', { roomId });

  res.sendStatus(204);
};

const getMessages = async (req: ExpressRequest, res: ExpressResponse) => {
  const { roomId } = req.params;

  if (!roomId || typeof roomId !== 'string') {
    throw ApiError.badRequest('Room id required');
  }

  const room = await roomRepository.getRoomWithMessages(roomId);

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  res.status(200).send(room.messages);
};

const change = async (req: ExpressRequest, res: ExpressResponse) => {
  const { roomId } = req.params;

  if (!roomId || typeof roomId !== 'string') {
    throw ApiError.badRequest('Room is required');
  }

  const { title } = req.body;

  if (!title) {
    throw ApiError.badRequest('Title is required');
  }

  const room = await roomRepository.getById(roomId);

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (room.userId !== req.user.id) {
    throw ApiError.unauthorized('Permission denied');
  }

  const updatedRoom = await roomRepository.change(roomId, { title });

  getIO().to(roomId).emit('room_updated', formatRoom(updatedRoom));

  res.sendStatus(204);
};

const join = async (req: ExpressRequest, res: ExpressResponse) => {
  const { roomId, inviteUrl } = req.params;

  if (!roomId || !inviteUrl) {
    throw ApiError.badRequest('Room id and invite url is mandatory');
  }

  if (typeof roomId !== 'string' || typeof inviteUrl !== 'string') {
    throw ApiError.badRequest('Invalid type of roomId or inviteUrl');
  }

  const room = await roomRepository.getById(roomId);

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (room.inviteUrl !== inviteUrl) {
    throw ApiError.badRequest('Invalid invite url');
  }

  const alreadyMember = await roomRepository.isMember(roomId, req.user.id);

  if (alreadyMember) {
    throw ApiError.conflict('User is already a member of this room');
  }

  const member = await roomRepository.addMember(roomId, req.user.id);

  getIO().to(roomId).emit('room_join', sanitiseUser(member.user));

  res.sendStatus(200);
};

const leave = async (req: ExpressRequest, res: ExpressResponse) => {
  const { roomId } = req.body;

  if (!roomId) {
    throw ApiError.badRequest('Room id is required');
  }

  const room = await roomRepository.getById(roomId);

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  const isMember = await roomRepository.isMember(roomId, req.user.id);

  if (!isMember) {
    throw ApiError.badRequest('User is not a member of this room');
  }

  if (room.userId === req.user.id) {
    throw ApiError.badRequest('Admin cannot leave the room, but can delete it');
  }

  await roomRepository.removeMember(roomId, req.user.id);

  getIO().to(roomId).emit('room_leave', sanitiseUser(req.user));

  res.sendStatus(200);
};

const generateInviteUrl = async (req: ExpressRequest, res: ExpressResponse) => {
  const { roomId } = req.body;

  if (!roomId) {
    throw ApiError.badRequest('Room id is required');
  }

  const room = await roomRepository.getById(roomId);

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (room.userId !== req.user.id) {
    throw ApiError.unauthorized('Permission denied');
  }

  const inviteUrl = Buffer.from(
    await bcrypt.hash(roomId, +process.env.SALT_OF_ROUNDS),
  ).toString('base64');

  await roomRepository.change(room.id, { inviteUrl });

  res.status(200).send(inviteUrl);
};

const deleteInviteUrl = async (req: ExpressRequest, res: ExpressResponse) => {
  const { roomId } = req.body;

  if (!roomId) {
    throw ApiError.badRequest('Room id is required');
  }

  const room = await roomRepository.getById(roomId);

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  if (room.userId !== req.user.id) {
    throw ApiError.unauthorized('Permission denied');
  }

  await roomRepository.change(roomId, { inviteUrl: null });

  res.sendStatus(201);
};

const getRoomInfoByInvite = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  const { roomId, inviteUrl } = req.params;

  if (
    !roomId ||
    !inviteUrl ||
    typeof roomId !== 'string' ||
    typeof inviteUrl !== 'string'
  ) {
    throw ApiError.badRequest('Room id and invite url is mandatory');
  }

  const room = await roomRepository.getById(roomId);

  if (!room || room.inviteUrl !== inviteUrl) {
    throw ApiError.badRequest('Invalid invite url');
  }

  res.status(200).send({ id: room.id, title: room.title });
};

const getMembers = async (req: ExpressRequest, res: ExpressResponse) => {
  const { roomId } = req.params;

  if (!roomId || typeof roomId !== 'string') {
    throw ApiError.badRequest('Room id is required');
  }

  const room = await roomRepository.getById(roomId);

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  const isMember = await roomRepository.isMember(roomId, req.user.id);

  if (!isMember) {
    throw ApiError.unauthorized('You are not a member of this room');
  }

  const users = room.members.map((m) => sanitiseUser(m.user));

  res.status(200).send(users);
};

export default {
  create,
  deleteRoom,
  getMessages,
  change,
  generateInviteUrl,
  deleteInviteUrl,
  join,
  leave,
  getUserRooms,
  getRoomInfoByInvite,
  getMembers,
};
