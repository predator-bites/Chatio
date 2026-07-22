import { User as PrismaUser } from '../../generated/prisma/client';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
    interface User extends PrismaUser {}
  }
}
