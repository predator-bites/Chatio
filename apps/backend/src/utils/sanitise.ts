import { User } from '../../generated/prisma/client';

const sanitiseUser = (user?: User | null) => {
  if (!user) return null;
  const { id, username, email } = user;
  return {
    id,
    username,
    email,
  };
};

export default sanitiseUser;
