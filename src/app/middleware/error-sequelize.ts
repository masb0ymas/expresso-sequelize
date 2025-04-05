import { green } from 'colorette'
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import { BaseError, EmptyResultError, ValidationError } from 'sequelize'
import { logger } from '~/config/logger'

export default async function expressErrorSequelize(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof BaseError) {
    const msgType = green('sequelize')
    logger.error(`${msgType} - err, ${err.message ?? err}`)

    if (err instanceof EmptyResultError) {
      return res.status(404).json({
        code: 404,
        error: 'Not Found',
        message: `${msgType} ${err.message}`,
      })
    }

    if (err instanceof ValidationError) {
      const errors: any[] = _.get(err, 'errors', [])
      const errorMessage = _.get(errors, '0.message', null)

      const dataError = {
        code: 400,
        message: errorMessage ? `Validation error: ${errorMessage}` : err.message,
        errors: errors.reduce((acc, curVal) => {
          acc[curVal.path] = curVal.message
          return acc
        }, {}),
      }

      return res.status(400).json(dataError)
    }

    return res.status(500).json({
      code: 500,
      error: 'Internal Server Error',
      message: `${msgType} ${err.message}`,
    })
  }

  next(err)
}
