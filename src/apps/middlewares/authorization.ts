import { extractToken, verifyToken } from '@core/helpers/token'
import { type NextFunction, type Request, type Response } from 'express'
import { printLog } from 'expresso-core'
import _ from 'lodash'

/**
 * Authorization
 * @param req
 * @param res
 * @param next
 * @returns
 */
async function authorization(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  const getToken = extractToken(req)
  const token = verifyToken(String(getToken))

  if (_.isEmpty(token?.data)) {
    const logMessage = printLog('Permission :', 'Unauthorized', {
      label: 'error',
    })
    console.log(logMessage)

    return res.status(401).json({ code: 401, message: token?.message })
  }

  req.setState({ userLogin: token?.data })
  next()
}

export default authorization
