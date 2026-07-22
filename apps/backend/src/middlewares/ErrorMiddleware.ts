import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/ApiError';

const ErrorMiddleware = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ApiError) {
    res.status(error.code).json(error.data);
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};

export default ErrorMiddleware;
