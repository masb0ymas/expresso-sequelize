import asyncHandler from '@expresso/helpers/asyncHandler'
import { currentToken } from '@expresso/helpers/Token'
import BuildResponse from '@expresso/modules/Response/BuildResponse'
import AuthService from 'controllers/Auth/service'
import RefreshTokenService from 'controllers/RefreshToken/service'
import { Request, Response } from 'express'
import Authorization from 'middlewares/Authorization'
import { UserLoginAttributes } from 'models/user'
import routes from 'routes/public'

routes.post(
  '/auth/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
    const formData = req.getBody()
    const data = await AuthService.signUp(formData)
    const buildResponse = BuildResponse.get({ message: data.message })

    return res.status(201).json(buildResponse)
  })
)

routes.post(
  '/auth/sign-in',
  asyncHandler(async function signIn(req: Request, res: Response) {
    const formData = req.getBody()
    const data = await AuthService.signIn(req, formData)
    const buildResponse = BuildResponse.get(data)

    return res
      .cookie('token', data.accessToken, {
        maxAge: Number(data.expiresIn) * 1000, // 7 Days
        httpOnly: true,
        path: '/v1',
        secure: process.env.NODE_ENV === 'production',
      })
      .json(buildResponse)
  })
)

routes.post(
  '/auth/refresh-token',
  Authorization,
  asyncHandler(async function authRefreshToken(req: Request, res: Response) {
    const { email, refreshToken } = req.getBody()

    const data = await RefreshTokenService.getAccessToken(email, refreshToken)
    const buildResponse = BuildResponse.get(data)

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/profile',
  Authorization,
  asyncHandler(async function getProfile(req: Request, res: Response) {
    const userData = req.getState('userLogin') as UserLoginAttributes

    const data = await AuthService.profile(userData.uid)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/auth/verify-session',
  Authorization,
  asyncHandler(async function getProfile(req: Request, res: Response) {
    const userData = req.getState('userLogin') as UserLoginAttributes
    const getToken = currentToken(req)

    const data = await AuthService.verifySession(userData.uid, getToken)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/logout',
  Authorization,
  asyncHandler(async function logout(req: Request, res: Response) {
    const { UserId } = req.getBody()
    const userData = req.getState('userLogin') as UserLoginAttributes
    const getToken = currentToken(req)

    const message = await AuthService.logout(UserId, userData, getToken)
    const buildResponse = BuildResponse.deleted({ message })

    return res.clearCookie('token', { path: '/v1' }).json(buildResponse)
  })
)
