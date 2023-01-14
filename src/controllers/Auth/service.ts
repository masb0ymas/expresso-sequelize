import { MAIL_PASSWORD, MAIL_USERNAME } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import SessionService from '@controllers/Account/Session/service'
import userSchema from '@controllers/Account/User/schema'
import UserService from '@controllers/Account/User/service'
import User, {
  LoginAttributes,
  UserAttributes,
  UserLoginAttributes,
} from '@database/entities/User'
import ConstRole from '@expresso/constants/ConstRole'
import { validateBoolean, validateEmpty } from '@expresso/helpers/Formatter'
import SendMail from '@expresso/helpers/SendMail'
import { generateAccessToken, verifyAccessToken } from '@expresso/helpers/Token'
import { optionsYup } from '@expresso/helpers/Validation'
import { ReqOptions } from '@expresso/interfaces/ReqOptions'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { DtoLogin } from './interface'

class AuthService {
  /**
   *
   * @param formData
   * @returns
   */
  public static async signUp(formData: UserAttributes): Promise<User> {
    const randomToken = generateAccessToken({ uuid: uuidv4() })

    const newFormData = {
      ...formData,
      isActive: validateBoolean(formData.isActive),
      tokenVerify: randomToken.accessToken,
      RoleId: ConstRole.ID_USER,
    }

    const value = userSchema.register.validateSync(newFormData, optionsYup)

    const formRegistration = {
      ...value,
      phone: validateEmpty(formData.phone),
      password: value.confirmNewPassword,
    }

    const newData = await User.create(formRegistration)

    // check if exist mail_username & mail_password
    if (MAIL_USERNAME && MAIL_PASSWORD) {
      // send email notification
      SendMail.AccountRegistration({
        email: value.email,
        fullname: value.fullname,
        token: randomToken.accessToken,
      })
    }

    return newData
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async signIn(
    formData: LoginAttributes,
    options?: ReqOptions
  ): Promise<DtoLogin> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.login.validateSync(formData, optionsYup)

    const getUser = await User.scope('withPassword').findOne({
      where: { email: value.email },
    })

    // check user account
    if (!getUser) {
      const message = i18nConfig.t('errors.account_not_found', i18nOpt)
      throw new ResponseError.NotFound(message)
    }

    // check active account
    if (!getUser.isActive) {
      const message = i18nConfig.t('errors.please_check_your_email', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const matchPassword = getUser.comparePassword(value.password)

    // compare password
    if (!matchPassword) {
      const message = i18nConfig.t('errors.incorrect_email_or_pass', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const payloadToken = { uid: getUser.id }
    const accessToken = generateAccessToken(payloadToken)

    const message = i18nConfig.t('success.login', i18nOpt)

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
   * @param options
   * @returns
   */
  public static async verifySession(
    UserId: string,
    token: string,
    options?: ReqOptions
  ): Promise<User | null> {
    const getSession = await SessionService.findByUserToken(UserId, token)
    const verifyToken = verifyAccessToken(getSession.token)

    const userToken = verifyToken?.data as UserLoginAttributes

    if (!_.isEmpty(userToken.uid)) {
      const getUser = await UserService.findById(userToken.uid, { ...options })

      return getUser
    }

    return null
  }

  /**
   *
   * @param UserId
   * @param token
   * @param options
   * @returns
   */
  public static async logout(
    UserId: string,
    token: string,
    options?: ReqOptions
  ): Promise<string> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const getUser = await UserService.findById(UserId, { ...options })

    // clean session
    await SessionService.deleteByUserToken(getUser.id, token)
    const message = i18nConfig.t('success.logout', i18nOpt)

    return message
  }
}

export default AuthService
