import { i18NConfig } from '@config/i18nextConfig'
import SessionService from '@controllers/Account/Session/service'
import userSchema from '@controllers/Account/User/schema'
import UserService from '@controllers/Account/User/service'
import models from '@database/models/index'
import {
  LoginAttributes,
  UserAttributes,
  UserInstance,
  UserLoginAttributes,
} from '@database/models/user'
import ConstRole from '@expresso/constants/ConstRole'
import { validateEmpty } from '@expresso/helpers/Formatter'
import SendMail from '@expresso/helpers/SendMail'
import { generateAccessToken, verifyAccessToken } from '@expresso/helpers/Token'
import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

const { User } = models

interface DtoLogin {
  tokenType: string
  user: {
    uid: string
  }
  accessToken: string
  expiresIn: number
  message: string
}

class AuthService {
  /**
   *
   * @param formData
   * @param lang
   * @returns
   */
  public static async signUp(
    formData: UserAttributes,
    lang?: string
  ): Promise<UserInstance> {
    const randomToken = generateAccessToken({ uuid: uuidv4() })

    await UserService.validateEmail(formData.email)

    const newFormData = {
      ...formData,
      phone: validateEmpty(formData.phone),
      tokenVerify: randomToken.accessToken,
      RoleId: ConstRole.ID_USER,
    }

    const value = useValidation(userSchema.register, newFormData)
    const data = await User.create(value)

    // send email notification
    SendMail.AccountRegistration(
      {
        email: value.email,
        fullName: `${value.firstName} ${value.lastName}`,
        token: randomToken.accessToken,
      },
      lang
    )

    return data
  }

  /**
   *
   * @param formData
   * @param lang
   * @returns
   */
  public static async signIn(
    formData: LoginAttributes,
    lang?: string
  ): Promise<DtoLogin> {
    const i18nOpt: string | TOptions = { lng: lang }

    const value = useValidation(userSchema.login, formData)

    const getUser = await User.scope('withPassword').findOne({
      where: { email: value.email },
    })

    // check user account
    if (!getUser) {
      const message = i18NConfig.t('errors.accountNotFound', i18nOpt)
      throw new ResponseError.NotFound(message)
    }

    // check active account
    if (!getUser.isActive) {
      const message = i18NConfig.t('errors.pleaseCheckYourEmail', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const matchPassword = await getUser.comparePassword(value.password)

    // compare password
    if (!matchPassword) {
      const message = i18NConfig.t('errors.incorrectEmailOrPassword', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const payloadToken = { uid: getUser.id }
    const accessToken = generateAccessToken(payloadToken)

    const message = i18NConfig.t('success.login', i18nOpt)

    const newData = {
      message,
      ...accessToken,
      tokenType: 'Bearer',
      user: payloadToken,
    }

    return newData
  }

  /**
   *
   * @param UserId
   * @param token
   * @returns
   */
  public static async verifySession(
    UserId: string,
    token: string
  ): Promise<UserInstance | null> {
    const getSession = await SessionService.findByUserToken(UserId, token)
    const verifyToken = verifyAccessToken(getSession.token)

    const userToken = verifyToken?.data as UserLoginAttributes

    if (!_.isEmpty(userToken.uid)) {
      const getUser = await UserService.findById(userToken.uid)
      return getUser
    }

    return null
  }

  /**
   *
   * @param UserId
   * @param token
   * @param lang
   * @returns
   */
  public static async logout(
    UserId: string,
    token: string,
    lang?: string
  ): Promise<string> {
    const i18nOpt: string | TOptions = { lng: lang }

    const getUser = await UserService.findById(UserId)

    // clean session
    await SessionService.deleteByUserToken(getUser.id, token)
    const message = i18NConfig.t('success.logout', i18nOpt)

    return message
  }
}

export default AuthService
