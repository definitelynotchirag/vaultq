import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';

// Load .env file only if it exists (for local development)
// In Docker, environment variables are provided by docker-compose via env_file
const envPath = path.resolve(__dirname, '../.env');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import './config/passport';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import fileRoutes from './routes/files';
import sharedRoutes from './routes/shared';

const app: Application = express();

// Trust proxy - required when running behind a reverse proxy (Docker, nginx, etc.)
// This allows express-rate-limit to correctly identify users via X-Forwarded-For header
app.set('trust proxy', true);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/shared', sharedRoutes);
app.use('/files', fileRoutes);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

export default app;

