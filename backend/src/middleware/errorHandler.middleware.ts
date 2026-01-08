import { Request, Response, NextFunction } from 'express'

import AppError from '../error/app.error'
import { ErrorCode } from '../error/errorCodes'

/**
 * Error middleware.
 * Express executes this code when:
 * 1. There is a throw inside a route
 * 2. A promise is rejected
 * 
 * Express takes the error raised and pass it as the first argument
 */ 
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    })
  }

  console.error(err)

  return res.status(500).json({
    success: false,
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Unexpected error',
    },
  })
}
