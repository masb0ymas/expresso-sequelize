import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import { currentToken, verifyToken } from 'helpers/Token'
import Authorization from 'middlewares/Authorization'
import BuildResponse from 'modules/Response/BuildResponse'
import RefreshTokenService from 'controllers/RefreshToken/service'
import AuthService from './service'

routes.post(
  '/auth/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
    const formData = req.getBody()

    const { message, data } = await AuthService.signUp(formData)
    const buildResponse = BuildResponse.get({ message, data })

    return res.status(201).json(buildResponse)
  })
)

routes.post(
  '/auth/sign-in',
  asyncHandler(async function signIn(req: Request, res: Response) {
    const formData = req.getBody()
    const {
      accessToken,
      expiresIn,
      tokenType,
      refreshToken,
    } = await AuthService.signIn(formData)

    return res
      .cookie('token', accessToken, {
        maxAge: Number(expiresIn) * 1000, // 7 Days
        httpOnly: true,
        path: '/v1',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ accessToken, expiresIn, tokenType, refreshToken })
  })
)

routes.post(
  '/auth/refresh-token',
  Authorization,
  asyncHandler(async function authRefreshToken(req: Request, res: Response) {
    const { email, refreshToken } = req.getBody()

    const { accessToken, expiresIn } = await RefreshTokenService.getAccessToken(
      email,
      refreshToken
    )
    const buildResponse = BuildResponse.get({
      message: 'access token has been received',
      accessToken,
      expiresIn,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/profile',
  Authorization,
  asyncHandler(async function getProfile(req: Request, res: Response) {
    const getToken = currentToken(req)
    const token = verifyToken(getToken)

    // @ts-ignore
    const data = await AuthService.profile(token)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)
