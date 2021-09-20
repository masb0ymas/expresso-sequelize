import UserService from '@controllers/User/service'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import { UserLoginAttributes } from '@models/user'
import chalk from 'chalk'
import { NextFunction, Request, Response } from 'express'

function NotPermittedAccess(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userLogin = req.getState('userLogin') as UserLoginAttributes
    const getUser = await UserService.findById(userLogin.uid)

    if (roles.includes(getUser.RoleId)) {
      const message = 'You are not allowed'
      console.log(
        chalk.red('Not Permitted Access Error:'),
        chalk.green(message)
      )

      const httpResponse = HttpResponse.get({
        code: 403,
        message: `Not Permitted Access Error: ${message}`,
      })

      return res.status(403).json(httpResponse)
    }

    next()
  }
}

export default NotPermittedAccess
