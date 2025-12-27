import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw createError('Authentication required', 401);
  }
  next();
};

