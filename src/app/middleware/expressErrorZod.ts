import { green } from 'colorette'
import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { logger } from '~/config/pino'

/**
 * Express Error TypeORM
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
async function expressErrorZod(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  if (err instanceof z.ZodError) {
    const msgType = green('zod')
    const message = 'validation error!'

    logger.error(`${msgType} - ${message}`)

    const error = {
      code: 422,
      message,
      errors:
        err.errors.length > 0
          ? err.errors.reduce((acc: any, curVal: any) => {
              acc[`${curVal.path}`] = curVal.message || curVal.type
              return acc
            }, {})
          : {
              [`${err.errors[0].path}`]: err.errors[0].message,
            },
    }

    return res.status(422).json(error)
  }

  next(err)
}

export default expressErrorZod
