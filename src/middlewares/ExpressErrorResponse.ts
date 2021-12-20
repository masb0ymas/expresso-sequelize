import ResponseError from '@expresso/modules/Response/ResponseError'
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import multer from 'multer'

function generateErrorResponseError(
  e: Error,
  code: Number
):
  | string
  | {
      code: Number
      message: string
    } {
  return _.isObject(e.message) ? e.message : { code, message: e.message }
}

async function ExpressErrorResponse(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  if (err instanceof multer.MulterError) {
    return res.status(400).json(generateErrorResponseError(err, 400))
  }

  if (err instanceof ResponseError.BaseResponse) {
    return res
      .status(err.statusCode)
      .json(generateErrorResponseError(err, err.statusCode))
  }
  next(err)
}

export default ExpressErrorResponse
