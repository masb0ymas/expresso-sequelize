import { green } from 'colorette'
import { NextFunction, Request, Response } from 'express'
import { QueryFailedError } from 'typeorm'
import { logger } from '~/config/logger'

export default async function expressErrorTypeorm(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof QueryFailedError) {
    const msgType = green('typeorm')
    logger.error(`${msgType} - err, ${err.message ?? err}`)

    const result = {
      statusCode: 400,
      error: 'Bad Request',
      message: `${msgType} ${err.message}`,
    }

    return res.status(400).json(result)
  }

  next(err)
}
