import type { Router } from 'express'

import express from 'express'

import AuthController from '../controllers/auth.controller'

const authRouter: Router = express.Router()
const authController: AuthController = new AuthController()

authRouter.post('/login', authController.login)
authRouter.post('/register', authController.register)
authRouter.post('/googleLogin', authController.googleLogin)

export default authRouter
