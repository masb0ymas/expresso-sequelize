import { green } from 'colorette'
import { type NextFunction, type Request, type Response } from 'express'
import { useToken } from 'expresso-hooks'
import _ from 'lodash'
import { env } from '~/config/env'
import { logger } from '~/config/pino'
import SessionService from '../service/session.service'

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

  // verify token
  const token = useToken.verify({
    token: String(getToken),
    secretKey: env.JWT_SECRET_ACCESS_TOKEN,
  })

  // check session from token header
  const getSession = await SessionService.getByToken(String(getToken))

  if (_.isEmpty(token?.data) || _.isEmpty(getSession)) {
    const msgType = green('permission')
    logger.error(`${msgType} - unauthorized invalid jwt`)

    return res
      .status(401)
      .json({ code: 401, message: 'Unauthorized, invalid jwt' })
  }

  req.setState({ userLogin: token?.data })
  next()
}

export default authorization
