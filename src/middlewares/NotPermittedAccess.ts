import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import User, { UserLoginAttributes } from '@database/models/user'
import { logErrServer } from '@expresso/helpers/Formatter'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import { NextFunction, Request, Response } from 'express'
import { TOptions } from 'i18next'

function NotPermittedAccess(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const i18nOpt: string | TOptions = { lng: defaultLang }

    const userLogin = req.getState('userLogin') as UserLoginAttributes
    const getUser = await User.findByPk(userLogin.uid)

    const errType = `Not Permitted Access Error:`
    const message = 'You are not allowed'

    if (getUser && roles.includes(getUser.RoleId)) {
      // log error
      console.log(logErrServer(errType, message))

      const errMessage = i18nConfig.t('errors.permissionAccess', i18nOpt)
      const httpResponse = HttpResponse.get({
        code: 403,
        message: errMessage,
      })

      return res.status(403).json(httpResponse)
    }

    next()
  }
}

export default NotPermittedAccess
