// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import { currentToken, verifyToken } from 'helpers/Token'
import Authorization from 'middlewares/Authorization'
import AuthService from './service'

routes.post(
  '/auth/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
    const formData = req.getBody()
    const { message, data } = await AuthService.signUp(formData)

    return res.status(201).json({ message, data })
  })
)

routes.post(
  '/auth/sign-in',
  asyncHandler(async function signIn(req: Request, res: Response) {
    const formData = req.getBody()
    const { token, expiresIn, tokenType } = await AuthService.signIn(formData)

    return res
      .cookie('token', token, {
        maxAge: 7 * Number(expiresIn) * 1000, // 7 Days
        httpOnly: true,
        path: '/v1',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ token, expiresIn, tokenType })
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

    return res.status(200).json({ data })
  })
)
