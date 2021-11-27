import { LOG_SERVER } from '@config/baseURL'
import User, { UserLoginAttributes } from '@database/models/user'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import chalk from 'chalk'
import { NextFunction, Request, Response } from 'express'

function PermissionAccess(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userLogin = req.getState('userLogin') as UserLoginAttributes
    const getUser = await User.findByPk(userLogin.uid)

    const errType = `Permission Access Error:`
    const message = 'You are not allowed'

    if (getUser && !roles.includes(getUser.RoleId)) {
      // log error
      console.log(LOG_SERVER, chalk.red(errType), chalk.green(message))

      const httpResponse = HttpResponse.get({
        code: 403,
        message: `${errType} ${message}`,
      })

      return res.status(403).json(httpResponse)
    }

    next()
  }
}

export default PermissionAccess
