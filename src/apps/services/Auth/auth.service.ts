import { type DtoLogin } from '@apps/interface/Dto'
import userSchema from '@apps/schemas/user.schema'
import { MAIL_PASSWORD, MAIL_USERNAME } from '@config/env'
import { i18nConfig } from '@config/i18n'
import ConstRole from '@core/constants/ConstRole'
import SendMail from '@core/helpers/sendMails'
import { generateToken, verifyToken } from '@core/helpers/token'
import { optionsYup } from '@core/helpers/yup'
import { type ReqOptions } from '@core/interface/ReqOptions'
import ResponseError from '@core/modules/response/ResponseError'
import User, {
  type LoginAttributes,
  type UserLoginAttributes,
} from '@database/entities/User'
import { validateEmpty } from 'expresso-core'
import { type TOptions } from 'i18next'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import SessionService from '../Account/session.service'
import UserService from '../Account/user.service'
import Role from '@database/entities/Role'
import Upload from '@database/entities/Upload'
import Session from '@database/entities/Session'

export default class AuthService {
  /**
   *
   * @param formData
   * @returns
   */
  public static async signUp(formData: any): Promise<User> {
    const uid = uuidv4()
    const { token } = generateToken({ token: uid })

    let RoleId = ConstRole.ID_USER

    // check role
    if (formData.roleAs === 'USER') {
      RoleId = ConstRole.ID_USER
    }

    const newFormData = {
      ...formData,
      isActive: false,
      phone: validateEmpty(formData.phone),
      UploadId: validateEmpty(formData.UploadId),
      tokenVerify: token,
      RoleId,
    }

    const value = userSchema.register.validateSync(newFormData, optionsYup)

    const formRegister: any = {
      ...value,
      password: value.confirmNewPassword,
    }

    const newData = await User.create({ ...formRegister })

    // send mail if mail username & password exists
    if (MAIL_USERNAME && MAIL_PASSWORD) {
      await SendMail.accountRegistration({
        email: formData.email,
        fullname: formData.fullname,
      })
    }

    return newData
  }

  /**
   *
   * @param formData
   * @param options
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

    const matchPassword = await getUser.comparePassword(value.password)

    // compare password
    if (!matchPassword) {
      const message = i18nConfig.t('errors.incorrect_email_or_pass', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const payloadToken = { uid: getUser.id }
    const { token, expiresIn } = generateToken(payloadToken)

    const message = i18nConfig.t('success.login', i18nOpt)

    const newData = {
      message,
      accessToken: token,
      expiresIn,
      tokenType: 'Bearer',
      user: payloadToken,
      fullname: getUser.fullname,
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
    const validateToken = verifyToken(getSession.token)

    const userToken = validateToken?.data as UserLoginAttributes

    if (!_.isEmpty(userToken.uid)) {
      const getUser = await UserService.findById(userToken.uid, {
        ...options,
        include: [{ model: Role }, { model: Upload }, { model: Session }],
      })

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
