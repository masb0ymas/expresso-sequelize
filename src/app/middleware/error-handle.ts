import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import multer from 'multer'
import ErrorResponse from '~/lib/http/errors'

interface DtoErrorResponse {
  statusCode: number
  error: string
  message: string
}

function generateErrorResponse(err: Error, statusCode: number): DtoErrorResponse {
  return _.isObject(err.message)
    ? err.message
    : { statusCode, error: err.name, message: err.message }
}

export default async function expressErrorHandle(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  // catch error from multer
  if (err instanceof multer.MulterError) {
    return res.status(400).json(generateErrorResponse(err, 400))
  }

  // catch from global error
  if (err instanceof ErrorResponse.BaseResponse) {
    return res.status(err.statusCode).json(generateErrorResponse(err, err.statusCode))
  }

  next(err)
}
