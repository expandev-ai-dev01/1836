import { Request, Response, NextFunction } from 'express';
import { errorResponse, StatusGeneralError } from './crud';

export function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', error);

  if (error.name === 'ZodError') {
    return res.status(400).json(errorResponse('Validation Error', 'VALIDATION_ERROR'));
  }

  if (error.code === 'ENOENT') {
    return res.status(404).json(errorResponse('Resource not found', 'NOT_FOUND'));
  }

  res.status(StatusGeneralError).json(errorResponse(error.message || 'Internal Server Error'));
}
