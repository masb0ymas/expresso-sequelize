import { logErrServer } from '@expresso/helpers/Formatter'
import { currentToken, verifyAccessToken } from '@expresso/helpers/Token'
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'

async function Authorization(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  const getToken = currentToken(req)
  const token = verifyAccessToken(getToken)

  if (_.isEmpty(token?.data)) {
    console.log(logErrServer('Permission:', 'Unauthorized!'))

    return res.status(401).json({
      code: 401,
      message: token?.message,
    })
  }

  req.setState({ userLogin: token?.data })
  next()
}

export default Authorization
