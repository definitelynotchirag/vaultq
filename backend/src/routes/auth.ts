import { Request, Response, Router } from 'express';
import passport from 'passport';
import { authRateLimiter } from '../config/rateLimiter';
import { requireAuth } from '../middleware/auth';
import { IUser } from '../types';

const router = Router();

router.get(
  '/google',
  authRateLimiter,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  authRateLimiter,
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
  }),
  (_req: Request, res: Response) => {
    return res.redirect('/auth/success');
  }
);

router.get('/me', requireAuth, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  const user = req.user as IUser;
  return res.json({
    success: true,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
  });
});

router.post('/logout', requireAuth, (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ success: false, error: 'Logout failed' });
      return;
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

router.get('/success', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Authentication successful' });
});

router.get('/failure', (_req: Request, res: Response) => {
  res.status(401).json({ success: false, error: 'Authentication failed' });
});

export default router;

