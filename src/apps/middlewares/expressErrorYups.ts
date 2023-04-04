import { type NextFunction, type Request, type Response } from 'express'
import { printLog } from 'expresso-core'
import { ValidationError } from 'yup'

/**
 * Express Error Yup
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
async function expressErrorYup(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  if (err instanceof ValidationError) {
    const errType = `Yup Validation Error:`
    const message = err.errors.join('<br/>') || 'Yup Validation Error !'

    const logMessage = printLog(errType, message, { label: 'error' })
    console.log(logMessage)

    const error = {
      code: 422,
      message,
      errors:
        err.inner.length > 0
          ? err.inner.reduce((acc: any, curVal: any) => {
              acc[`${curVal.path}`] = curVal.message || curVal.type
              return acc
            }, {})
          : { [`${err.path}`]: err.message || err.type },
    }
    return res.status(422).json(error)
  }

  next(err)
}

export default expressErrorYup
