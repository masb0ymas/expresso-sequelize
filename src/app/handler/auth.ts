import express, { Request, Response } from 'express'
import { env } from '~/config/env'
import { asyncHandler } from '~/lib/async-handler'
import ErrorResponse from '~/lib/http/errors'
import HttpResponse from '~/lib/http/response'
import JwtToken from '~/lib/token/jwt'
import { UserLoginState } from '../database/schema/user'
import authorization from '../middleware/authorization'
import { UserAgentState } from '../middleware/user-agent'
import AuthService from '../service/auth'

const route = express.Router()
const service = new AuthService()

const jwt = new JwtToken({ secret: env.JWT_SECRET, expires: env.JWT_EXPIRES })

route.post(
  '/sign-up',
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()
    await service.register(values)
    const httpResponse = HttpResponse.created({ message: 'User registered successfully' })
    res.status(201).json(httpResponse)
  })
)

route.post(
  '/sign-in',
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()
    const userAgentState = req.getState('userAgent') as UserAgentState
    const clientIp = req.getState('clientIp') as string

    const data = await service.login({
      ...values,
      ip_address: clientIp,
      device: userAgentState.device,
      platform: userAgentState.platform,
      user_agent: userAgentState.source,
    })

    const httpResponse = HttpResponse.get({
      data,
      message: 'Login successfully',
    })

    res
      .status(200)
      .cookie('token', data.access_token, {
        maxAge: Number(data.expires_in) * 1000,
        httpOnly: true,
        path: '/v1',
        secure: process.env.NODE_ENV === 'production',
      })
      .json(httpResponse)
  })
)

route.get(
  '/verify-session',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const token = jwt.extract(req)
    const { uid: user_id } = req.getState('userLoginState') as UserLoginState

    const data = await service.verifySession({ token: String(token), user_id })
    const httpResponse = HttpResponse.get({
      data,
      message: 'Session verified successfully',
    })
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/sign-out',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()

    const token = jwt.extract(req)
    const { uid: user_id } = req.getState('userLoginState') as UserLoginState

    if (formData.user_id !== user_id) {
      throw new ErrorResponse.Forbidden('you are not allowed')
    }

    const { message } = await service.logout({ token: String(token), user_id })

    const httpResponse = HttpResponse.get({ message })
    res.status(200).json(httpResponse)
  })
)

export { route as AuthHandler }
