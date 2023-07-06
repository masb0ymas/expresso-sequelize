import { type Request } from 'express'
import { validateBoolean, validateEmpty } from 'expresso-core'
import { useSequelize } from 'expresso-query'
import { type TOptions } from 'i18next'
import _ from 'lodash'
import { Op, type Includeable } from 'sequelize'
import { env } from '~/config/env'
import { i18n } from '~/config/i18n'
import { type IReqOptions } from '~/core/interface/ReqOptions'
import { type DtoFindAll } from '~/core/interface/dto/Paginate'
import { useQuery } from '~/core/modules/hooks/useQuery'
import ResponseError from '~/core/modules/response/ResponseError'
import { validateUUID } from '~/core/utils/formatter'
import Role from '~/database/entities/Role'
import Session from '~/database/entities/Session'
import Upload from '~/database/entities/Upload'
import User, { type UserAttributes } from '~/database/entities/User'
import userSchema from '../schema/user.schema'

const relations: Includeable[] = [
  { model: Role },
  { model: Upload },
  { model: Session },
]

export default class UserService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoFindAll<User>> {
    const reqQuery = req.getQuery()

    const defaultLang = reqQuery.lang ?? env.APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const query = useQuery({
      entity: User,
      reqQuery,
      includeRule: useSequelize.makeIncludeQueryable(
        reqQuery.filtered,
        relations
      ),
    })

    const data = await User.findAll({
      ...query,
      order: query.order ? query.order : [['created_at', 'desc']],
    })

    const total = await User.count({
      include: query.includeCount,
      where: query.where,
    })

    const message = i18n.t('success.data_received', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   * Find By Id
   * @param id
   * @param options
   * @returns
   */
  public static async _findOne(
    id: string,
    options?: IReqOptions
  ): Promise<User> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await User.findOne({
      where: { id: newId },
      include: options?.include,
      paranoid: options?.paranoid,
    })

    if (!data) {
      const options = { ...i18nOpt, entity: 'user' }
      const message = i18n.t('errors.not_found', options)

      throw new ResponseError.NotFound(message)
    }

    return data
  }

  /**
   * Find By Id
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: IReqOptions
  ): Promise<User> {
    const data = await this._findOne(id, {
      ...options,
      include: [{ model: Role }, { model: Upload }, { model: Session }],
    })

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(formData: UserAttributes): Promise<User> {
    const value = userSchema.create.parse({
      ...formData,
      phone: validateEmpty(formData.phone),
    })

    const data = await User.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @param options
   * @returns
   */
  public static async update(
    id: string,
    formData: UserAttributes,
    options?: IReqOptions
  ): Promise<User> {
    const data = await this._findOne(id, { ...options })

    // validate email from request
    if (!_.isEmpty(formData.email) && formData.email !== data.email) {
      await this.validateEmail(String(formData.email), { ...options })
    }

    const value = userSchema.create.parse(formData)

    const newFormData = {
      ...data,
      ...value,
      phone: validateEmpty(value?.phone),
      password: validateEmpty(value?.confirm_new_password),
    }

    const newData = await data.update({ ...data, ...newFormData })

    return newData
  }

  /**
   *
   * @param id
   * @param formData
   * @param options
   */
  public static async changePassword(
    id: string,
    formData: Partial<UserAttributes>,
    options?: IReqOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.changePassword.parse(formData)

    const newId = validateUUID(id, { ...options })
    const getUser = await User.scope('withPassword').findOne({
      where: { id: newId },
    })

    // check user account
    if (!getUser) {
      const message = i18n.t('errors.account_not_found', i18nOpt)
      throw new ResponseError.NotFound(message)
    }

    const matchPassword = await getUser.comparePassword(value.current_password)

    // compare password
    if (!matchPassword) {
      const message = i18n.t('errors.incorrect_current_pass', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    // update password
    await getUser.update({
      ...getUser,
      password: value.confirm_new_password,
    })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async restore(
    id: string,
    options?: IReqOptions
  ): Promise<void> {
    const data = await this._findOne(id, { ...options, paranoid: false })
    await data.restore()
  }

  /**
   *
   * @param id
   * @param options
   */
  private static async _delete(
    id: string,
    options?: IReqOptions
  ): Promise<void> {
    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.force)

    const data = await this._findOne(id, { ...options })
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async softDelete(
    id: string,
    options?: IReqOptions
  ): Promise<void> {
    // soft delete
    await this._delete(id, options)
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async forceDelete(
    id: string,
    options?: IReqOptions
  ): Promise<void> {
    // force delete
    await this._delete(id, { ...options, force: true })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static _validateGetByIds(ids: string[], options?: IReqOptions): void {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    if (_.isEmpty(ids)) {
      const message = i18n.t('errors.cant_be_empty', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }
  }

  /**
   *
   * @param ids
   * @param options
   */
  public static async multipleRestore(
    ids: string[],
    options?: IReqOptions
  ): Promise<void> {
    this._validateGetByIds(ids, options)

    await User.restore({ where: { id: { [Op.in]: ids } } })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static async _multipleDelete(
    ids: string[],
    options?: IReqOptions
  ): Promise<void> {
    // validate empty ids
    this._validateGetByIds(ids, options)

    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.force)

    await User.destroy({ where: { id: { [Op.in]: ids } }, force: isForce })
  }

  /**
   *
   * @param ids
   * @param options
   */
  public static async multipleSoftDelete(
    ids: string[],
    options?: IReqOptions
  ): Promise<void> {
    // multiple soft delete
    await this._multipleDelete(ids, options)
  }

  /**
   *
   * @param ids
   * @param options
   */
  public static async multipleForceDelete(
    ids: string[],
    options?: IReqOptions
  ): Promise<void> {
    // multiple force delete
    await this._multipleDelete(ids, { ...options, force: true })
  }

  /**
   *
   * @param email
   * @param options
   */
  public static async validateEmail(
    email: string,
    options?: IReqOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const data = await User.findOne({
      where: { email },
    })

    if (data) {
      const message = i18n.t('errors.already_email', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }
  }
}
