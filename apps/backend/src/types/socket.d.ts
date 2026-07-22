// types/socket.d.ts
import { IncomingMessage } from 'http';
import { Session, SessionData } from 'express-session';

declare module 'http' {
  interface IncomingMessage {
    session: Session & Partial<SessionData>;
    sessionID: string;
    user?: Express.User;
    isAuthenticated(): boolean;
    isUnauthenticated(): boolean;
  }
}
