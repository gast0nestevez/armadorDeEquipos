import type { Application, Request, Response } from 'express';
import type { RateLimitRequestHandler } from 'express-rate-limit';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { connectDB } from '#config/db.ts';
import { authRouter } from '#routes/auth.route.ts';
import { matchRouter } from '#routes/match.route.ts';
import { getEnv } from '#utils/env.ts';

dotenv.config();

const app: Application = express();

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use('/auth', authRouter);
app.use('/match', matchRouter);
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

connectDB();

const PORT: string = getEnv('PORT') || '3000';
app.listen(PORT, (): void => console.log(`Server running on ${getEnv('BASE_URL')}:${PORT}`));
