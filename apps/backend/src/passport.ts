import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userRepository from './repository/user.repository';
import bcrypt from 'bcrypt';
import { User } from '../generated/prisma/client';
import ApiError from './utils/ApiError';

const initPassport = () => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await userRepository.getByUsername(username);

      if (!user) {
        done('Incorrect username', false);
        return;
      }

      if (!(await bcrypt.compare(password, user.password))) {
        done('Incorrect password', false);
        return;
      }

      done(null, user);
    }),
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
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

  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as User).id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      done(null, await userRepository.getById(id));
    } catch (err) {
      done('Incorrect id', false);
    }
  });
};

export default initPassport;
