import { LOG_SERVER } from '@config/baseURL'
import { logErrServer } from '@expresso/helpers/Formatter'
import { NextFunction, Request, Response } from 'express'
import { get } from 'lodash'
import { BaseError, EmptyResultError, ValidationError } from 'sequelize'

function msg(message: string): string {
  return `Sequelize Error: ${message}`
}

async function ExpressErrorSequelize(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  if (err instanceof BaseError) {
    if (err instanceof EmptyResultError) {
      return res.status(404).json({
        code: 404,
        message: msg('Data not found'),
      })
    }

    if (err instanceof ValidationError) {
      const errors: any[] = get(err, 'errors', [])
      const errorMessage = get(errors, '0.message', null)

      console.log(logErrServer('Sequelize Error:', errorMessage))

      const dataError = {
        code: 400,
        message: errorMessage
          ? `Validation error: ${errorMessage}`
          : err.message,
        errors: errors.reduce<any>((acc, curVal) => {
          acc[curVal.path] = curVal.message
          return acc
        }, {}),
      }

      console.log(LOG_SERVER, dataError.message, dataError.errors)

      return res.status(400).json(dataError)
    }

    return res.status(500).json({
      code: 500,
      message: msg(err.message),
    })
  }

  next(err)
}

export default ExpressErrorSequelize
