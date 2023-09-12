import { green } from 'colorette'
import { type NextFunction, type Request, type Response } from 'express'
import { type TOptions } from 'i18next'
import { env } from '~/config/env'
import { i18n } from '~/config/i18n'
import { logger } from '~/config/pino'
import User, { type UserLoginAttributes } from '~/database/entities/User'

/**
 * Permission Access
 * @param roles
 * @returns
 */
export function permissionAccess(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const userLogin = req.getState('userLogin') as UserLoginAttributes
    const getUser = await User.findOne({
      where: { id: userLogin.uid },
    })

    const errType = `not permitted access error:`
    const errMessage = 'you are not allowed'

    if (getUser && !roles.includes(getUser.role_id)) {
      // log error
      const msgType = green('permission')
      logger.error(`${msgType} - ${errType} ${errMessage}`)

      const message = i18n.t('errors.permission_access', i18nOpt)

      return res.status(403).json({
        code: 403,
        message: `${errType} ${message}`,
      })
    }

    next()
  }
}

/**
 *
 * @param roles
 * @returns
 */
export function notPermittedAccess(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const userLogin = req.getState('userLogin') as UserLoginAttributes
    const getUser = await User.findOne({
      where: { id: userLogin.uid },
    })

    const errType = `not permitted access error:`
    const errMessage = 'you are not allowed'

    if (getUser && roles.includes(getUser.role_id)) {
      // log error
      const msgType = green('permission')
      logger.error(`${msgType} - ${errType} ${errMessage}`)

      const message = i18n.t('errors.permission_access', i18nOpt)

      return res.status(403).json({
        code: 403,
        message: `${errType} ${message}`,
      })
    }

    next()
  }
}
