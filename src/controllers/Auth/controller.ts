import { BASE_URL_CLIENT } from '@config/baseURL'
import SessionService from '@controllers/Session/service'
import User, { UserLoginAttributes } from '@database/models/user'
import asyncHandler from '@expresso/helpers/asyncHandler'
import { validateEmpty } from '@expresso/helpers/Formatter'
import { currentToken, verifyAccessToken } from '@expresso/helpers/Token'
import userAgentHelper from '@expresso/helpers/userAgent'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import ResponseError from '@expresso/modules/Response/ResponseError'
import Authorization from '@middlewares/Authorization'
import route from '@routes/v1'
import { Request, Response } from 'express'
import _ from 'lodash'
import AuthService from './service'

route.post(
  '/auth/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await AuthService.signUp(formData)

    const httpResponse = HttpResponse.created({ data })
    return res.status(201).json(httpResponse)
  })
)

route.post(
  '/auth/sign-in',
  asyncHandler(async function signIn(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await AuthService.signIn(formData)
    const httpResponse = HttpResponse.get(data)

    // create session
    await SessionService.createOrUpdate({
      UserId: data.user.uid,
      token: data.accessToken,
      ipAddress: req.clientIp?.replace('::ffff:', ''),
      device: userAgentHelper.currentDevice(req),
      platform: userAgentHelper.currentPlatform(req),
      latitude: validateEmpty(formData.latitude),
      longitude: validateEmpty(formData.longitude),
    })

    return res
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
  Authorization,
  asyncHandler(async function verifySession(req: Request, res: Response) {
    const getToken = currentToken(req)
    const userLogin = req.getState('userLogin') as UserLoginAttributes

    const data = await AuthService.verifySession(userLogin.uid, getToken)

    const httpResponse = HttpResponse.get({ data })
    return res.status(200).json(httpResponse)
  })
)

route.post(
  '/logout',
  Authorization,
  asyncHandler(async function logout(req: Request, res: Response) {
    const formData = req.getBody()
    const getToken = currentToken(req)
    const userLogin = req.getState('userLogin') as UserLoginAttributes

    if (userLogin.uid !== formData.UserId) {
      throw new ResponseError.BadRequest('invalid user login')
    }

    const message = await AuthService.logout(userLogin.uid, getToken)
    const httpResponse = HttpResponse.get({ message })

    return res
      .status(200)
      .clearCookie('token', { path: '/v1' })
      .json(httpResponse)
  })
)

route.get(
  '/email/verify',
  asyncHandler(async function emailVerify(req: Request, res: Response) {
    const { token } = req.getQuery()
    const tokenVerify = verifyAccessToken(token)

    console.log({ tokenVerify })

    let redirectUrl = ''
    const getUser = await User.findOne({ where: { tokenVerify: token } })

    if (!getUser || _.isEmpty(tokenVerify?.data)) {
      // redirect error page frontend web
      redirectUrl = `${BASE_URL_CLIENT}/email-verify/error`
    } else {
      // update is active user
      await getUser.update({ isActive: true })

      // redirect success page frontend web
      redirectUrl = `${BASE_URL_CLIENT}/email-verify/success`
    }

    return res.redirect(redirectUrl)
  })
)
