import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import models from '@database/models/index'
import { UserAttributes, UserInstance } from '@database/models/user'
import db from '@database/models/_instance'
import Excel from '@expresso/helpers/Excel'
import { validateBoolean, validateUUID } from '@expresso/helpers/Formatter'
import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import {
  DtoFindAll,
  SqlizeOptions,
} from '@expresso/modules/SqlizeQuery/interface'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { TOptions } from 'i18next'
import _ from 'lodash'
import userSchema from './schema'

interface DtoPaginate extends DtoFindAll {
  data: UserInstance[]
}

const { Sequelize } = db
const { Op } = Sequelize

const { User, Role, Session } = models
const including = [{ model: Role }]
const includeSession = [{ model: Role }, { model: Session }]

class UserService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
    const { filtered, lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      User,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await User.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await User.count({
      include: includeCount,
      where: queryFind.where,
    })

    const message = i18nConfig.t('success.dataReceived', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findByPk(
    id: string,
    options?: SqlizeOptions
  ): Promise<UserInstance> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { lang: options?.lang })
    const data = await User.findByPk(newId, {
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.notFound', i18nOpt)
      throw new ResponseError.NotFound(`user ${message}`)
    }

    return data
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: SqlizeOptions
  ): Promise<UserInstance> {
    const data = await this.findByPk(id, { ...options })

    return data
  }

  /**
   *
   * @param id
   * @param paranoid
   * @returns
   */
  public static async findUserWithSession(
    id: string,
    options?: SqlizeOptions
  ): Promise<UserInstance> {
    const data = await this.findByPk(id, {
      paranoid: options?.paranoid,
      include: includeSession,
    })

    return data
  }

  /**
   *
   * @param email
   * @param options
   * @returns
   */
  public static async validateEmail(
    email: string,
    options?: SqlizeOptions
  ): Promise<null> {
    const i18nOpt: string | TOptions = { lng: options?.lang }
    const data = await User.findOne({ where: { email } })

    if (data) {
      const message = i18nConfig.t('errors.alreadyEmail', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    return null
  }

  /**
   *
   * @param RoleIds
   * @returns
   */
  public static async findByRoleIds(
    RoleIds: string[]
  ): Promise<UserInstance[]> {
    const data = await User.findAll({
      where: { RoleId: { [Op.in]: RoleIds } },
    })

    return data
  }

  /**
   *
   * @param formData
   * @param options
   * @returns
   */
  public static async create(
    formData: UserAttributes,
    options?: SqlizeOptions
  ): Promise<UserInstance> {
    const value = useValidation(userSchema.register, formData)
    const data = await User.create(value, { transaction: options?.transaction })

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
    formData: Partial<UserAttributes>,
    options?: SqlizeOptions
  ): Promise<UserInstance> {
    const data = await this.findByPk(id)

    const value = useValidation(userSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

    if (value.email !== data.email) {
      await this.validateEmail(value.email)
    }

    await data.update(value ?? {}, { transaction: options?.transaction })

    return data
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async delete(
    id: string,
    options?: SqlizeOptions
  ): Promise<void> {
    const isForce = validateBoolean(options?.force)

    const data = await this.findByPk(id, { lang: options?.lang })
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async restore(
    id: string,
    options?: SqlizeOptions
  ): Promise<void> {
    const data = await this.findByPk(id, {
      paranoid: false,
      lang: options?.lang,
    })

    await data.restore()
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   * @param options
   */
  public static async multipleDelete(
    ids: string[],
    options?: SqlizeOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }
    const isForce = validateBoolean(options?.force)

    if (_.isEmpty(ids)) {
      const message = i18nConfig.t('errors.cantBeEmpty', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }

    await User.destroy({
      where: { id: { [Op.in]: ids } },
      force: isForce,
    })
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   * @param options
   */
  public static async multipleRestore(
    ids: string[],
    options?: SqlizeOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    if (_.isEmpty(ids)) {
      const message = i18nConfig.t('errors.cantBeEmpty', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }

    await User.restore({
      where: { id: { [Op.in]: ids } },
    })
  }

  /**
   *
   * @param req
   * @returns
   */
  public static async generateExcel(req: Request): Promise<Buffer> {
    const { data } = await this.findAll(req)
    const jsonData = JSON.parse(JSON.stringify(data))

    const header = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'First Name', key: 'firstName', width: 20 },
      { header: 'Last Name', key: 'lastName', width: 20 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Role', key: 'role', width: 20 },
    ]

    const newData = []
    for (let i = 0; i < jsonData.length; i += 1) {
      const item = jsonData[i]
      newData.push({
        ...item,
        role: _.get(item, 'Role.name', '-'),
      })
    }

    const stream: Buffer = await Excel.generate(header, newData)

    return stream
  }
}

export default UserService
