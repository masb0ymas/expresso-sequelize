import { NextFunction, Request, Response } from 'express'
import ResponseError from 'modules/Response/ResponseError'
import { isObject } from 'lodash'

function generateErrorResponseError(e: Error, code: Number) {
  return isObject(e.message) ? e.message : { code, message: e.message }
}

async function ExpressErrorResponse(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ResponseError.BaseResponse) {
    return res
      .status(err.statusCode)
      .json(generateErrorResponseError(err, err.statusCode))
  }
  next(err)
}

export default ExpressErrorResponse
