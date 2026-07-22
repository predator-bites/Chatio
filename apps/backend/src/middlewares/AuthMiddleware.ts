import {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import ApiError from '../utils/ApiError';

const AuthMiddleware = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  if (!req.isAuthenticated()) {
    throw ApiError.unauthorized('User is not logged in');
  }

  next();
};

export default AuthMiddleware;
