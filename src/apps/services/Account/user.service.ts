import userSchema from '@apps/schemas/user.schema'
import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18n'
import { validateUUID } from '@core/helpers/formatter'
import { optionsYup } from '@core/helpers/yup'
import { makeIncludeQueryable } from '@core/hooks/Query/PluginSqlizeQuery'
import useQuery from '@core/hooks/useQuery'
import { type DtoFindAll } from '@core/interface/Paginate'
import { type ReqOptions } from '@core/interface/ReqOptions'
import ResponseError from '@core/modules/response/ResponseError'
import Role from '@database/entities/Role'
import Session from '@database/entities/Session'
import User, { type UserAttributes } from '@database/entities/User'
import { type Request } from 'express'
import { validateBoolean, validateEmpty } from 'expresso-core'
import { type TOptions } from 'i18next'
import _ from 'lodash'
import { Op } from 'sequelize'

const relations = [{ model: Role }, { model: Session }]

export default class UserService {
  /**
   * Find All
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoFindAll<User>> {
    const reqQuery = req.getQuery()

    const defaultLang = reqQuery.lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const query = useQuery({
      entity: User,
      reqQuery,
      includeRule: makeIncludeQueryable(reqQuery.filtered, relations),
    })

    const data = await User.findAll({
      ...query,
      order: query.order ? query.order : [['createdAt', 'desc']],
    })

    const total = await User.count({
      include: query.includeCount,
      where: query.where,
    })

    const message = i18nConfig.t('success.data_received', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   * Find By Id
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: ReqOptions
  ): Promise<User> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await User.findOne({
      where: { id: newId },
      include: options?.include,
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`user ${message}`)
    }

    return data
  }

  /**
   *
   * @param email
   * @param options
   */
  public static async validateEmail(
    email: string,
    options?: ReqOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const data = await User.findOne({ where: { email } })

    if (data) {
      const message = i18nConfig.t('errors.already_email', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }
  }

  /**
   * Create
   * @param formData
   * @returns
   */
  public static async create(formData: UserAttributes): Promise<User> {
    const value = userSchema.create.validateSync(formData, optionsYup)

    const data = await User.create(value)

    return data
  }

  /**
   * Update
   * @param id
   * @param formData
   * @param options
   * @returns
   */
  public static async update(
    id: string,
    formData: Partial<UserAttributes>,
    options?: ReqOptions
  ): Promise<User> {
    const data = await this.findById(id, { ...options })

    // validate email from request
    if (!_.isEmpty(formData.email) && formData.email !== data.email) {
      await this.validateEmail(String(formData.email), { ...options })
    }

    const value = userSchema.create.validateSync(formData, optionsYup)

    const newFormData = {
      ...data,
      ...value,
      phone: validateEmpty(value?.phone),
      password: validateEmpty(value?.confirmNewPassword),
    }

    const newData = await data.update({ ...data, ...newFormData })

    return newData
  }

  /**
   * Restore
   * @param id
   * @param options
   */
  public static async restore(id: string, options?: ReqOptions): Promise<void> {
    const data = await this.findById(id, { ...options, paranoid: false })
    await data.restore()
  }

  /**
   * Delete
   * @param id
   * @param options
   */
  private static async _delete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.force)

    const data = await this.findById(id, { ...options })
    await data.destroy({ force: isForce })
  }

  /**
   * Soft Delete
   * @param id
   * @param options
   */
  public static async softDelete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    // soft delete
    await this._delete(id, options)
  }

  /**
   * Force Delete
   * @param id
   * @param options
   */
  public static async forceDelete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    // force delete
    await this._delete(id, { ...options, force: true })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static _validateIds(ids: string[], options?: ReqOptions): void {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    if (_.isEmpty(ids)) {
      const message = i18nConfig.t('errors.cant_be_empty', i18nOpt)
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
    options?: ReqOptions
  ): Promise<void> {
    // validate empty ids
    this._validateIds(ids, options)

    await User.restore({ where: { id: { [Op.in]: ids } } })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static async _multipleDelete(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    // validate empty ids
    this._validateIds(ids, options)

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
    options?: ReqOptions
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
    options?: ReqOptions
  ): Promise<void> {
    // multiple force delete
    await this._multipleDelete(ids, { ...options, force: true })
  }
}
