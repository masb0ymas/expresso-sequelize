import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18n'
import User, { type UserLoginAttributes } from '@database/entities/User'
import { type NextFunction, type Request, type Response } from 'express'
import { printLog } from 'expresso-core'
import { type TOptions } from 'i18next'

/**
 * Not Permitted Access
 * @param roles
 * @returns
 */
function notPermittedAccess(roles: string[]) {
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
      const logMessage = printLog(errType, errMessage, { label: 'error' })
      console.log(logMessage)

      const message = i18nConfig.t('errors.permission_access', i18nOpt)

      return res.status(403).json({
        code: 403,
        message: `${errType} ${message}`,
      })
    }

    next()
  }
}

export default notPermittedAccess
