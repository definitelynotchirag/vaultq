import { Request, Response, Router } from 'express';
import passport from 'passport';
import { authRateLimiter } from '../config/rateLimiter';
import { requireAuth } from '../middleware/auth';
import { IUser } from '../types';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

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
    failureRedirect: `${FRONTEND_URL}/auth/failure`,
  }),
  (req: Request, res: Response) => {
    // Ensure session is saved before redirecting
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect(`${FRONTEND_URL}/auth/failure`);
      }
      return res.redirect(`${FRONTEND_URL}/auth/success`);
    });
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
  res.redirect(`${FRONTEND_URL}/auth/success`);
});

router.get('/failure', (_req: Request, res: Response) => {
  res.redirect(`${FRONTEND_URL}/auth/failure`);
});

export default router;

