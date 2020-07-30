// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express'
import { EmptyResultError, ValidationError } from 'sequelize'
import { get } from 'lodash'

async function ExpressErrorSequelize(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  await req.rollbackTransactions()
  if (err instanceof EmptyResultError) {
    return res.status(404).json({
      message: 'Data not found',
    })
  }

  if (err instanceof ValidationError) {
    console.log('ERROR SEQUELIZE VALIDATION!!!')
    const errors: any[] = get(err, 'errors', [])
    const errorMessage = get(errors, '0.message', null)

    const dataError = {
      message: errorMessage ? `Validation error: ${errorMessage}` : err.message,
      errors: errors.reduce<any>((acc, curVal) => {
        acc[curVal.path] = curVal.message
        return acc
      }, {}),
    }

    console.log(dataError.message, dataError.errors)

    return res.status(400).json(dataError)
  }

  next(err)
}

export default ExpressErrorSequelize
