import { type NextFunction, type Request, type Response } from 'express'
import _ from 'lodash'
import multer from 'multer'
import ResponseError from '~/core/modules/response/ResponseError'

interface DtoErrorResponse {
  code: number
  message: string
}

/**
 *
 * @param err - Error
 * @param code - Status Code
 * @returns
 */
function generateErrorResponse(err: Error, code: number): DtoErrorResponse {
  return _.isObject(err.message) ? err.message : { code, message: err.message }
}

/**
 *
 * @param err - Error
 * @param _req - Request
 * @param res - Response
 * @param next - NextFunction
 * @returns
 */
async function expressErrorResponse(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  // catch error from multer
  if (err instanceof multer.MulterError) {
    return res.status(400).json(generateErrorResponse(err, 400))
  }

  // catch from global error
  if (err instanceof ResponseError.BaseResponse) {
    return res
      .status(err.statusCode)
      .json(generateErrorResponse(err, err.statusCode))
  }

  next(err)
}

export default expressErrorResponse
