// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import { verifyToken } from 'helpers/Token'
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
    const { token, expiresIn, tokenType, uid } = await AuthService.signIn(
      formData
    )

    return res.status(200).json({ token, expiresIn, tokenType, uid })
  })
)

routes.get(
  '/profile',
  Authorization,
  asyncHandler(async function getProfile(req: Request, res: Response) {
    const token = verifyToken(req.getHeaders())
    // @ts-ignore
    const data = await AuthService.profile(token)

    return res.status(200).json({ data })
  })
)
