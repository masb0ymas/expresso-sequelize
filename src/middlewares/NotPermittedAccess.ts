import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import User, { UserLoginAttributes } from '@database/entities/User'
import { logErrServer } from '@expresso/helpers/Formatter'
import { NextFunction, Request, Response } from 'express'
import { TOptions } from 'i18next'

function NotPermittedAccess(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const userLogin = req.getState('userLogin') as UserLoginAttributes
    const getUser = await User.findOne({
      where: { id: userLogin.uid },
    })

    const errType = `Not Permitted Access Error:`
    const errMessage = 'You are not allowed'

    if (getUser && roles.includes(getUser.RoleId)) {
      // log error
      console.log(logErrServer(errType, errMessage))

      const message = i18nConfig.t('errors.permission_access', i18nOpt)

      return res.status(403).json({
        code: 403,
        message: `${errType} ${message}`,
      })
    }

    next()
  }
}

export default NotPermittedAccess
