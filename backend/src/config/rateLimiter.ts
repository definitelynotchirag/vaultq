import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: 'Too many authentication requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const fileRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Too many file requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});


