import type { Application, Request, Response } from 'express'
import type { RateLimitRequestHandler } from 'express-rate-limit'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import authRouter from './src/routes/auth.route'
import matchRouter from './src/routes/match.route'
import { connectDB } from './src/config/db'

dotenv.config()

const app: Application = express()

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(limiter)

app.use('/auth', authRouter)
app.use('/match', matchRouter)
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() })
})

connectDB()

const PORT: string = process.env.PORT || '3000'
app.listen(PORT, (): void => console.log(`Server running on ${process.env.BASE_URL}:${PORT}`))
