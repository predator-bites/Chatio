import {
  UserUncheckedCreateInput,
  UserUncheckedUpdateInput,
} from '../../generated/prisma/models';
import prisma from '../db';

const create = (data: UserUncheckedCreateInput) => {
  return prisma.user.create({
    data,
  });
};

const getById = (id: string) => {
  return prisma.user.findFirst({
    where: {
      id,
    },
  });
};

const getByUsername = (username: string) => {
  return prisma.user.findFirst({
    where: {
      username,
    },
  });
};

const getByEmail = (email: string) => {
  return prisma.user.findFirst({
    where: { email },
  });
};

const change = (id: string, data: UserUncheckedUpdateInput) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export default {
  create,
  getById,
  getByUsername,
  getByEmail,
  change,
};
