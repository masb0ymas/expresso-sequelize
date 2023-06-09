import { type Request, type Response } from 'express'
import { validateEmpty } from 'expresso-core'
import { useToken } from 'expresso-hooks'
import { type TOptions } from 'i18next'
import { env } from '~/config/env'
import { i18n } from '~/config/i18n'
import { type DtoUserAgent } from '~/core/interface/dto/UserAgent'
import HttpResponse from '~/core/modules/response/HttpResponse'
import ResponseError from '~/core/modules/response/ResponseError'
import { asyncHandler } from '~/core/utils/asyncHandler'
import { type UserLoginAttributes } from '~/database/entities/User'
import route from '~/routes/v1'
import authorization from '../middleware/authorization'
import AuthService from '../service/auth.service'
import SessionService from '../service/session.service'

route.post(
  '/auth/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const formData = req.getBody()

    await AuthService.signUp(formData)
    const message = i18n.t('success.register', i18nOpt)

    const httpResponse = HttpResponse.get({ message })
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/auth/sign-in',
  asyncHandler(async function signIn(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG

    const userAgent = req.getState('userAgent') as DtoUserAgent
    const formData = req.getBody()

    const data = await AuthService.signIn(formData, { lang: defaultLang })
    const httpResponse = HttpResponse.get(data)

    // create session
    await SessionService.createOrUpdate({
      user_id: String(data.user.uid),
      token: data.accessToken,
      ip_address: req.clientIp?.replace('::ffff:', ''),
      device: userAgent.os,
      platform: userAgent.platform,
      latitude: validateEmpty(formData.latitude),
      longitude: validateEmpty(formData.longitude),
    })

    res
      .status(200)
      .cookie('token', data.accessToken, {
        maxAge: Number(data.expiresIn) * 1000,
        httpOnly: true,
        path: '/v1',
        secure: process.env.NODE_ENV === 'production',
      })
      .json(httpResponse)
  })
)

route.get(
  '/auth/verify-session',
  authorization,
  asyncHandler(async function verifySession(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG

    const token = useToken.extract(req)
    const userLogin = req.getState('userLogin') as UserLoginAttributes

    const data = await AuthService.verifySession(userLogin.uid, String(token), {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/logout',
  authorization,
  asyncHandler(async function logout(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const formData = req.getBody()
    const token = useToken.extract(req)
    const userLogin = req.getState('userLogin') as UserLoginAttributes

    // check user login not same user id at formData
    if (userLogin.uid !== formData.user_id) {
      const message = i18n.t('errors.invalid_user_login', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const message = await AuthService.logout(userLogin.uid, String(token), {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get({ message })
    res.status(200).clearCookie('token', { path: '/v1' }).json(httpResponse)
  })
)
