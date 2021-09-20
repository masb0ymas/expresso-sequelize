import UserService from '@controllers/User/service'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import { UserLoginAttributes } from '@models/user'
import chalk from 'chalk'
import { NextFunction, Request, Response } from 'express'

function PermissionAccess(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userLogin = req.getState('userLogin') as UserLoginAttributes
    const getUser = await UserService.findById(userLogin.uid)

    if (!roles.includes(getUser.RoleId)) {
      const message = 'You are not allowed'
      console.log(chalk.red('Permission Access Error:'), chalk.green(message))

      const httpResponse = HttpResponse.get({
        code: 403,
        message: `Permission Access Error: ${message}`,
      })

      return res.status(403).json(httpResponse)
    }

    next()
  }
}

export default PermissionAccess
