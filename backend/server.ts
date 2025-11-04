import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRouter from './src/routes/auth.route'

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/auth', authRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on ${process.env.BASE_URL}:${PORT}`))
