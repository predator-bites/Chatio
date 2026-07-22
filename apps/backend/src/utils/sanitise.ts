import { User } from '../../generated/prisma/client';

const sanitiseUser = ({ id, username, email }: User) => {
  return {
    id,
    username,
    email,
  };
};

export default sanitiseUser;
