import type { Application, Request, Response } from 'express';
import type { RateLimitRequestHandler } from 'express-rate-limit';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { connectDB } from '#config/db.ts';
import { errorHandler } from '#middleware/errorHandler.middleware.ts';
import { authRouter } from '#routes/auth.route.ts';
import { matchRouter } from '#routes/match.route.ts';
import { getEnv } from '#utils/env.ts';

dotenv.config();

const app: Application = express();

const DEV_FRONTEND_URL: string = 'http://localhost:5173';

const getAllowedOrigins: () => string[] = (): string[] => {
  if (process.env.NODE_ENV === 'development') {
    return [DEV_FRONTEND_URL];
  }

  const origins: string | undefined = process.env.FRONTEND_URL;
  if (!origins) {
    throw new Error('Missing environment variable: FRONTEND_URL');
  }

  return origins.split(',').map((origin: string): string => origin.trim());
};

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for endpoints open to brute force (login, register, Google login)
const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// Behind Render's proxy, otherwise every client shares the proxy IP for rate limiting
app.set('trust proxy', 1);

app.use(cors({ origin: getAllowedOrigins() }));
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use('/auth', authLimiter, authRouter);
app.use('/match', matchRouter);
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.use(errorHandler);

connectDB();

const PORT: string = getEnv('PORT') || '3000';
app.listen(PORT, (): void => console.log(`Server running on ${getEnv('BASE_URL')}:${PORT}`));
