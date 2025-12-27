import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
import passport from 'passport';
import './config/passport';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import fileRoutes from './routes/files';

const app: Application = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

export default app;

