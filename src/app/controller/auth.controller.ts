import { type Request, type Response } from 'express'
import { validate } from 'expresso-core'
import { useToken } from 'expresso-hooks'
import { type TOptions } from 'i18next'
import { env } from '~/config/env'
import { i18n } from '~/config/i18n'
import { type DtoUserAgent } from '~/core/interface/dto/UserAgent'
import ErrorResponse from '~/core/modules/response/ErrorResponse'
import HttpResponse from '~/core/modules/response/HttpResponse'
import { asyncHandler } from '~/core/utils/asyncHandler'
import { type UserLoginAttributes } from '~/database/entities/User'
import v1Route from '~/routes/v1'
import authorization from '../middleware/authorization'
import AuthService from '../service/auth.service'
import SessionService from '../service/session.service'

const route = v1Route
const routePath = `/auth`
const newAuthService = new AuthService()
const newSessionService = new SessionService()

route.post(
  `${routePath}/sign-up`,
  asyncHandler(async function signUp(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const formData = req.getBody()

    await newAuthService.signUp(formData)
    const message = i18n.t('success.register', i18nOpt)

    const httpResponse = HttpResponse.get({ message })
    res.status(200).json(httpResponse)
  })
)

route.post(
  `${routePath}/sign-in`,
  asyncHandler(async function signIn(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG

    const userAgent = req.getState('userAgent') as DtoUserAgent
    const formData = req.getBody()

    const data = await newAuthService.signIn(formData, { lang: defaultLang })
    const httpResponse = HttpResponse.get(data)

    // create session
    await newSessionService.createOrUpdate({
      user_id: String(data.user.uid),
      token: data.accessToken,
      ip_address: req.clientIp?.replace('::ffff:', ''),
      device: userAgent.os,
      platform: userAgent.platform,
      latitude: validate.empty(formData.latitude),
      longitude: validate.empty(formData.longitude),
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
  `${routePath}/verify-session`,
  authorization,
  asyncHandler(async function verifySession(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG

    const token = useToken.extract(req)
    const userLogin = req.getState('userLogin') as UserLoginAttributes

    const data = await newAuthService.verifySession(
      userLogin.uid,
      String(token),
      {
        lang: defaultLang,
      }
    )

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

route.post(
  `${routePath}/logout`,
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
      throw new ErrorResponse.BadRequest(message)
    }

    const message = await newAuthService.logout(userLogin.uid, String(token), {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get({ message })
    res.status(200).clearCookie('token', { path: '/v1' }).json(httpResponse)
  })
)
