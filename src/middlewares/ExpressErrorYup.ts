import { logErrServer } from '@expresso/helpers/Formatter'
import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'yup'

async function ExpressErrorYup(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  if (err instanceof ValidationError) {
    const errType = `Yup Validation Error:`
    const message = err.errors.join('<br/>') || 'Yup Validation Error !'

    console.log(logErrServer(errType, message))

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

export default ExpressErrorYup
