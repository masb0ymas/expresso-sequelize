import { type Request } from 'express'
import { validate } from 'expresso-core'
import { useSequelize } from 'expresso-query'
import { type TOptions } from 'i18next'
import _ from 'lodash'
import { type Includeable } from 'sequelize'
import { env } from '~/config/env'
import { i18n } from '~/config/i18n'
import { type IReqOptions } from '~/core/interface/ReqOptions'
import { type DtoFindAll } from '~/core/interface/dto/Paginate'
import { useQuery } from '~/core/modules/hooks/useQuery'
import ErrorResponse from '~/core/modules/response/ErrorResponse'
import { validateUUID } from '~/core/utils/uuid'
import Role from '~/database/entities/Role'
import Session from '~/database/entities/Session'
import Upload from '~/database/entities/Upload'
import User, { type UserAttributes } from '~/database/entities/User'
import userSchema from '../schema/user.schema'
import BaseService from './base.service'

const relations: Includeable[] = [
  { model: Role },
  { model: Upload },
  { model: Session },
]

export default class UserService extends BaseService {
  constructor() {
    super({ entity: 'user', repository: User })
  }

  /**
   *
   * @param req
   * @returns
   */
  public async findAll(req: Request): Promise<DtoFindAll<User>> {
    // OVERRIDE FIND ALL
    await super.findAll(req)

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
  public async findById(id: string, options?: IReqOptions): Promise<User> {
    // OVERRIDE FIND BY ID
    await super.findById(id, options)

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
  public async create(formData: UserAttributes): Promise<User> {
    const value = userSchema.create.parse({
      ...formData,
      phone: validate.empty(formData.phone),
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
  public async update(
    id: string,
    formData: UserAttributes,
    options?: IReqOptions
  ): Promise<User> {
    // OVERRIDE UPDATE
    await super.update(id, formData, options)

    const data = await this._findOne(id, { ...options })

    // validate email from request
    if (!_.isEmpty(formData.email) && formData.email !== data.email) {
      await this.validateEmail(String(formData.email), { ...options })
    }

    const value = userSchema.create.parse(formData)

    const newFormData = {
      ...data,
      ...value,
      phone: validate.empty(value?.phone),
      password: validate.empty(value?.confirm_new_password),
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
  public async changePassword(
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
      throw new ErrorResponse.NotFound(message)
    }

    const matchPassword = await getUser.comparePassword(value.current_password)

    // compare password
    if (!matchPassword) {
      const message = i18n.t('errors.incorrect_current_pass', i18nOpt)
      throw new ErrorResponse.BadRequest(message)
    }

    // update password
    await getUser.update({
      ...getUser,
      password: value.confirm_new_password,
    })
  }

  /**
   *
   * @param email
   * @param options
   */
  public async validateEmail(
    email: string,
    options?: IReqOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const data = await User.findOne({
      where: { email },
    })

    if (data) {
      const message = i18n.t('errors.already_email', i18nOpt)
      throw new ErrorResponse.BadRequest(message)
    }
  }
}
