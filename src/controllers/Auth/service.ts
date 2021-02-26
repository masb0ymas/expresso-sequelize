import ms from 'ms'
import models from 'models'
import jwt from 'jsonwebtoken'
import schemaAuth from 'controllers/Auth/schema'
import createDirNotExist from 'utils/Directory'
import useValidation from 'helpers/useValidation'
import ResponseError from 'modules/Response/ResponseError'
import { getUniqueCodev2 } from 'helpers/Common'
import { UserAttributes, LoginAttributes } from 'models/user'
import SendMail from 'helpers/SendEmail'
import RefreshTokenService from 'controllers/RefreshToken/service'
import UserService from 'controllers/User/service'
import SessionService from 'controllers/Session/service'
import { Request } from 'express'
import userAgentHelper from 'helpers/userAgent'
import { verifyAccessToken } from 'helpers/Token'
import { isEmpty } from 'lodash'

const { User, Role } = models
const including = [{ model: Role }]

const { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN }: any = process.env

const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED || '1d' // 1 Days
const JWT_REFRESH_TOKEN_EXPIRED = process.env.JWT_REFRESH_TOKEN_EXPIRED || '30d' // 30 Days

const expiresIn = ms(JWT_ACCESS_TOKEN_EXPIRED) / 1000

/*
  Create the main directory
  The directory will be created automatically when logged in,
  because there is a directory that uses a User ID
*/
async function createDirectory(UserId: string) {
  const pathDirectory = [
    './public/uploads/csv',
    './public/uploads/pdf',
    './public/uploads/excel',
    `./public/uploads/profile/${UserId}`,
  ]

  pathDirectory.map((x) => createDirNotExist(x))
}

class AuthService {
  /**
   *
   * @param formData
   */
  public static async signUp(formData: UserAttributes) {
    // check duplicate email
    await UserService.validateUserEmail(formData.email)

    const generateToken = {
      code: getUniqueCodev2(),
    }

    const tokenVerify = jwt.sign(
      JSON.parse(JSON.stringify(generateToken)),
      JWT_SECRET_ACCESS_TOKEN,
      {
        expiresIn,
      }
    )

    const newFormData = { ...formData, tokenVerify }
    const value = useValidation(schemaAuth.register, newFormData)
    const data = await User.create(value)

    // Initial Send an e-mail
    SendMail.AccountRegister(formData, tokenVerify)

    return {
      message:
        'registration is successful, check your email for the next steps',
      data,
    }
  }

  /**
   *
   * @param req - Request
   * @param formData
   */
  public static async signIn(req: Request, formData: LoginAttributes) {
    const { clientIp, useragent } = req

    const value = useValidation(schemaAuth.login, formData)

    const userData = await User.scope('withPassword').findOne({
      where: { email: value.email },
    })

    if (!userData) {
      throw new ResponseError.NotFound('account not found or has been deleted')
    }

    /* User active proses login */
    if (userData.active) {
      // @ts-ignore
      const comparePassword = await userData.comparePassword(value.password)

      if (comparePassword) {
        // modif payload token
        const payloadToken = {
          id: userData.id,
          nama: userData.fullName,
          email: userData.email,
          active: userData.active,
        }

        // Access Token
        const accessToken = jwt.sign(
          JSON.parse(JSON.stringify(payloadToken)),
          JWT_SECRET_ACCESS_TOKEN,
          {
            expiresIn,
          }
        )

        // Refresh Token
        const refreshToken = jwt.sign(
          JSON.parse(JSON.stringify(payloadToken)),
          JWT_SECRET_REFRESH_TOKEN,
          {
            expiresIn: JWT_REFRESH_TOKEN_EXPIRED,
          }
        )

        // create refresh token
        await RefreshTokenService.create({
          UserId: userData.id,
          token: refreshToken,
        })

        // create session
        await SessionService.create({
          UserId: userData.id,
          token: accessToken,
          ipAddress: clientIp?.replace('::ffff:', ''),
          device: userAgentHelper.currentDevice(req),
          platform: `${useragent?.os} - ${useragent?.platform}`,
        })

        // create directory
        await createDirectory(userData.id)

        return {
          message: 'Login successfully',
          accessToken,
          expiresIn,
          tokenType: 'Bearer',
          refreshToken,
          user: payloadToken,
        }
      }

      throw new ResponseError.BadRequest('incorrect email or password!')
    }

    /* User not active return error confirm email */
    throw new ResponseError.BadRequest(
      'please check your email account to verify your email and continue the registration process.'
    )
  }

  /**
   *
   * @param UserId
   * @param token
   */
  public static async verifySession(UserId: string, token: string) {
    const sessionUser = await SessionService.findByTokenUser(UserId, token)
    const verifyToken = verifyAccessToken(sessionUser.token)

    if (!isEmpty(verifyToken?.data)) {
      // @ts-ignore
      const data = await User.findByPk(verifyToken?.data?.id, {
        include: including,
      })
      return data
    }

    return null
  }

  /**
   *
   * @param token
   */
  public static async profile(userData: UserAttributes) {
    const data = await User.findByPk(userData.id, { include: including })
    return data
  }

  /**
   *
   * @param UserId
   * @param userData
   * @param token
   */
  public static async logout(UserId: string, userData: any, token: string) {
    if (userData?.id !== UserId) {
      throw new ResponseError.Unauthorized('Invalid user login!')
    }

    const data = await UserService.getOne(UserId)

    // clean refresh token & session
    await RefreshTokenService.delete(data.id)
    await SessionService.deleteByTokenUser(data.id, token)

    const message = 'You have logged out of the application'

    return message
  }
}

export default AuthService
