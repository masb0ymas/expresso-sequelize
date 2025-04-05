import { green } from 'colorette'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { logger } from '~/config/logger'

export default async function expressErrorValidation(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof z.ZodError) {
    const msgType = green('zod')
    const message = 'validation error!'

    logger.error(`${msgType} - ${message}`)

    const errors =
      err.errors.length > 0
        ? err.errors.reduce((acc: any, curVal: any) => {
            acc[`${curVal.path}`] = curVal.message || curVal.type
            return acc
          }, {})
        : { [`${err.errors[0].path}`]: err.errors[0].message }

    const result = {
      statusCode: 422,
      error: 'Unprocessable Content',
      message,
      errors,
    }

    return res.status(422).json(result)
  }

  next(err)
}
