import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
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

      if (user.auth_provider === 'google') {
        done(null, false, { message: 'Login with your Google Account', code: 400 })
      }

      if (!(await bcrypt.compare(password, user.password))) {
        done(null, false, { message: 'Incorrect password' });
        return;
      }

      done(null, user);
    }),
  );

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
          state: true
      },
      async function (accessToken, refreshToken, profile, done) {
        const email = profile.emails[0].value;

        const existingUser = await userRepository.getByEmail(email);

        if (existingUser) {
          done(null, existingUser);
          return;
        }

        const newUser = await userRepository.create({
          username: profile.displayName,
          email,
          auth_provider: 'google',
        });

        done(null, newUser);
      },
    ),
  );
  }

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
