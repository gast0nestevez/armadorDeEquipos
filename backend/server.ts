import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import authRouter from './src/routes/auth.route'
import matchRouter from './src/routes/match.route'
import connectDB from './src/config/db'

dotenv.config()

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/auth', authRouter)
app.use('/match', matchRouter)

connectDB()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on ${process.env.BASE_URL}:${PORT}`))
