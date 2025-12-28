import dotenv from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

// Load .env file only if it exists (for local development)
// In Docker, environment variables are provided by docker-compose via env_file
const envPath = path.resolve(__dirname, '../.env');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

import MongoStore from 'connect-mongo';
import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
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

// CORS origin must be set via FRONTEND_URL environment variable
// Remove trailing slash to match browser origin format
const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '');
if (!frontendUrl) {
  throw new Error('FRONTEND_URL environment variable is required');
}

app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Build cookie configuration
const cookieConfig: any = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/',
};

if (process.env.NODE_ENV === 'production') {
  cookieConfig.secure = true; // Required for HTTPS
  cookieConfig.sameSite = 'none'; // Required for cross-origin requests
  // Don't set domain - let it default to the request domain
} else {
  cookieConfig.secure = false;
  cookieConfig.sameSite = 'lax';
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: cookieConfig,
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

