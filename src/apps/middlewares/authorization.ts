import SessionService from '@apps/services/Account/session.service'
import { JWT_SECRET_ACCESS_TOKEN } from '@config/env'
import { type NextFunction, type Request, type Response } from 'express'
import { printLog } from 'expresso-core'
import { useToken } from 'expresso-hooks'
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
  const getToken = useToken.extract(req)

  const token = useToken.verify({
    token: String(getToken),
    secretKey: String(JWT_SECRET_ACCESS_TOKEN),
  })

  const getSession = await SessionService.getByToken(String(getToken))

  if (_.isEmpty(token?.data) || _.isEmpty(getSession)) {
    const logMessage = printLog('Permission :', 'Unauthorized', {
      label: 'error',
    })
    console.log(logMessage)

    return res
      .status(401)
      .json({ code: 401, message: 'Unauthorized, invalid jwt' })
  }

  req.setState({ userLogin: token?.data })
  next()
}

export default authorization
