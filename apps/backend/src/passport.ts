import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import userRepository from './repository/user.repository';
import bcrypt from 'bcrypt';
import { User } from '../generated/prisma/client';

const initPassport = () => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await userRepository.getByUsername(username);

      if (!user) {
        done(null, false, { message: 'Incorrect username', code: 401 });
        return;
      }

      if (!(await bcrypt.compare(password, user.password))) {
        done(null, false, { message: 'Incorrect password' });
        return;
      }

      done(null, user);
    }),
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as User).id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      done(null, await userRepository.getById(id));
    } catch {
      done('Incorrect id', false);
    }
  });
};

export default initPassport;
