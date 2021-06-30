import ConstRoles from '@expresso/constants/ConstRoles'
import { getUniqueCodev2 } from '@expresso/helpers/Common'
import { verifyAccessToken } from '@expresso/helpers/Token'
import userAgentHelper from '@expresso/helpers/userAgent'
import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import RefreshTokenService from 'controllers/RefreshToken/service'
import SessionService from 'controllers/Session/service'
import UserService from 'controllers/User/service'
import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { isEmpty } from 'lodash'
import models from 'models'
import {
  LoginAttributes,
  UserAttributes,
  UserLoginAttributes,
} from 'models/user'
import ms from 'ms'
import createDirNotExist from 'utils/Directory'
import authSchema from './schema'

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
const baseDestination = 'public/uploads'

async function createDirectory() {
  const pathDirectory = [
    `./${baseDestination}/csv`,
    `./${baseDestination}/pdf`,
    `./${baseDestination}/excel`,
    `./${baseDestination}/profile`,
    `./${baseDestination}/profile/resize`,
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

    const newFormData = { ...formData, tokenVerify, RoleId: ConstRoles.ID_UMUM }
    const value = useValidation(authSchema.register, newFormData)
    const data = await User.create(value)

    // send email verification
    // SendMail.AccountRegister(formData, tokenVerify)

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
    const { clientIp } = req

    const value = useValidation(authSchema.login, formData)

    const userData = await User.scope('withPassword').findOne({
      where: { email: value.email },
    })

    if (!userData) {
      throw new ResponseError.NotFound('account not found or has been deleted')
    }

    const { id: UserId, isActive } = userData

    /* User active proses login */
    if (isActive) {
      // @ts-ignore
      const matchPassword = await userData.comparePassword(value.password)

      if (matchPassword) {
        // modif payload token
        const payloadToken = { uid: UserId }

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
          UserId,
          token: refreshToken,
        })

        // create session
        const formDataSession = {
          UserId,
          token: accessToken,
          ipAddress: clientIp?.replace('::ffff:', ''),
          device: userAgentHelper.currentDevice(req),
          platform: userAgentHelper.currentPlatform(req),
        }
        await SessionService.createOrUpdate(formDataSession)

        // create directory
        await createDirectory()

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
    const userData = verifyToken?.data as UserLoginAttributes

    if (!isEmpty(userData.uid)) {
      // @ts-ignore
      const data = await User.findByPk(userData.uid, {
        include: including,
      })
      return data
    }

    return null
  }

  /**
   *
   * @param UserId
   */
  public static async profile(UserId: string) {
    const data = await User.findByPk(UserId, { include: including })
    return data
  }

  /**
   *
   * @param UserId
   * @param userData
   * @param token
   */
  public static async logout(
    UserId: string,
    userData: UserLoginAttributes,
    token: string
  ) {
    if (userData.uid !== UserId) {
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
