import { ResponseError } from '@chatio/types';

class ApiError extends Error {
  code: number;
  message: string;
  data: ResponseError;

  constructor(code: number, message: string, data: ResponseError) {
    super(message);

    this.code = code;
    this.message = message;
    this.data = data;
  }

  static internalServerError() {
    return new ApiError(500, 'Internal server error', {
      error: 'Internal server error',
    });
  }
  static badRequest(error: string) {
    return new ApiError(400, 'Bad request', { error });
  }
  static unauthorized(error: string) {
    return new ApiError(401, 'Unauthorized', { error });
  }
  static conflict(error: string) {
    return new ApiError(409, 'Conflict', { error });
  }
  static notFound(error: string) {
    return new ApiError(404, 'Not found', { error });
  }
}

export default ApiError;
