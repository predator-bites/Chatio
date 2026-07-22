import 'dotenv/config';
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import userRepository from '../repository/user.repository';
import ApiError from '../utils/ApiError';
import bcrypt from 'bcrypt';
import mailer from '../services/mailer.service';
import { v4 as uuidv4 } from 'uuid';

const create = async (req: ExpressRequest, res: ExpressResponse) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw ApiError.badRequest('Username, email and password is required');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    +process.env.SALT_OF_ROUNDS,
  );

  if (await userRepository.getByUsername(username)) {
    throw ApiError.conflict('Username has already been taken');
  }

  if (await userRepository.getByEmail(email)) {
    throw ApiError.conflict('Email has already been registered');
  }

  const submitUrl = uuidv4();
  const user = await userRepository.create({
    username,
    email,
    password: hashedPassword,
    submitUrl,
  });

  const htmlText = `
  <h2>Go to the link to submit your account</h2>
  <a href='${process.env.ORIGIN}/user/${user.id}/${submitUrl}'>Click here</a>
  `;

  await mailer.sendMail(user.email, htmlText);

  res.status(201).send(user);
};

const submit = async (req: ExpressRequest, res: ExpressResponse) => {
  const { id, submitUrl } = req.params;

  if (!id || !submitUrl) {
    throw ApiError.badRequest('User id and submit url are mandatory');
  }

  if (typeof id !== 'string' || typeof submitUrl !== 'string') {
    throw ApiError.badRequest('Invalid type of user id or submit url');
  }

  const user = await userRepository.getById(id);

  if (!user.submitUrl) {
    res.sendStatus(200);
    return;
  }

  if (user.submitUrl !== submitUrl) {
    throw ApiError.badRequest('Invalid submit url');
  }

  await userRepository.change(id, { submitUrl: null });

  res.sendStatus(200);
};

const changePassword = async (req: ExpressRequest, res: ExpressResponse) => {
  const { id, passwordChangeUrl } = req.params;
  const { password } = req.body;

  if (!password || !passwordChangeUrl || !id) {
    throw ApiError.badRequest(
      'Password, password change url and id is mandatory',
    );
  }

  if (
    typeof password !== 'string' ||
    typeof passwordChangeUrl !== 'string' ||
    typeof id !== 'string'
  ) {
    throw ApiError.badRequest('Invalid type of params');
  }

  const user = await userRepository.getById(id);

  if (!user) {
    throw ApiError.badRequest('User not found');
  }

  if (user.auth_provider !== 'local') {
    throw ApiError.badRequest('Login with your google accout');
  }

  if (user.passwordChangeUrl !== passwordChangeUrl) {
    throw ApiError.badRequest('Wrong password change url');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    +process.env.SALT_OF_ROUNDS,
  );

  await userRepository.change(user.id, {
    password: hashedPassword,
    passwordChangeUrl: null,
  });

  res.sendStatus(200);
};

const generatePasswordResetLink = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    throw ApiError.badRequest('Email is mandatory');
  }

  const user = await userRepository.getByEmail(email);

  if (!user) {
    throw ApiError.badRequest('User not found');
  }

  if (user.auth_provider !== 'local') {
    throw ApiError.badRequest('Login with your google account');
  }

  const passwordChangeUrl = uuidv4();

  await userRepository.change(user.id, { passwordChangeUrl });

  console.log(process.env.ORIGIN);

  const htmlText = `
  <h2>Go to the link to change your password</h2>
  <a href='${process.env.ORIGIN}/user/reset/${user.id}/${passwordChangeUrl}'>Click here</a>
  `;

  await mailer.sendMail(email, htmlText, 'Chatio account password change');

  res.sendStatus(200);
};

export default {
  create,
  changePassword,
  submit,
  generatePasswordResetLink,
};
