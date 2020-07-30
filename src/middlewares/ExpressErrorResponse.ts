// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express'
import ResponseError from 'modules/ResponseError'
import { isObject } from 'lodash'

function generateErrorResponseError(e: Error) {
  return isObject(e.message) ? e.message : { message: e.message }
}

async function ExpressErrorResponse(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ResponseError.BaseResponse) {
    return res.status(err.statusCode).json(generateErrorResponseError(err))
  }

  next(err)
}

export default ExpressErrorResponse
