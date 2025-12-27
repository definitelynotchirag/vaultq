import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const validateFileSize = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const size = req.body.size;

  if (!size || typeof size !== 'number') {
    throw createError('File size is required and must be a number', 400);
  }

  if (size <= 0) {
    throw createError('File size must be greater than 0', 400);
  }

  if (size > MAX_FILE_SIZE) {
    throw createError(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`, 400);
  }

  next();
};

