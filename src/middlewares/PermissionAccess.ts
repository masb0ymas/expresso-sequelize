import BuildResponse from '@expresso/modules/Response/BuildResponse'
import i18next from 'config/i18next'
import UserService from 'controllers/User/service'
import { NextFunction, Request, Response } from 'express'
import { UserLoginAttributes } from 'models/user'

function PermissionAccess(roles: Array<string>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userLogin = req.getState('userLogin') as UserLoginAttributes

    const { lang } = req.getQuery()
    const currentLang = lang || 'en'

    const message = i18next.t('errorMessage.youAreNotAllowed', {
      lng: currentLang,
    })

    const getUser = await UserService.findById(userLogin.uid)

    if (!roles.includes(getUser.RoleId)) {
      const buildResponse = BuildResponse.get({ code: 403, message })

      return res.status(403).json(buildResponse)
    }

    next()
  }
}

export default PermissionAccess
