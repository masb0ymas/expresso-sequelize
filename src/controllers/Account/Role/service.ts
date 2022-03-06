import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import UserService from '@controllers/Account/User/service'
import models from '@database/models/index'
import { RoleAttributes, RoleInstance } from '@database/models/role'
import db from '@database/models/_instance'
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
import roleSchema from './schema'

const { Sequelize } = db
const { Op } = Sequelize
const { Role } = models

interface DtoPaginate extends DtoFindAll {
  data: RoleInstance[]
}

class RoleService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Role,
      []
    )

    const data = await Role.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Role.count({
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
  ): Promise<RoleInstance> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { lang: options?.lang })
    const data = await Role.findByPk(newId, {
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.notFound', i18nOpt)
      throw new ResponseError.NotFound(`role ${message}`)
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
  ): Promise<RoleInstance> {
    const data = await this.findByPk(id, { ...options })

    return data
  }

  /**
   *
   * @param formData
   * @param options
   * @returns
   */
  public static async create(
    formData: RoleAttributes,
    options?: SqlizeOptions
  ): Promise<RoleInstance> {
    const value = useValidation(roleSchema.create, formData)
    const data = await Role.create(value, { transaction: options?.transaction })

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
    formData: Partial<RoleAttributes>,
    options?: SqlizeOptions
  ): Promise<RoleInstance> {
    const data = await this.findByPk(id, { lang: options?.lang })

    const value = useValidation(roleSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value ?? {}, { transaction: options?.transaction })

    return data
  }

  /**
   *
   * @param ModelEntity
   * @param target
   * @param options
   */
  private static async validateDelete<T>(
    ModelEntity: T[],
    target: string,
    options?: SqlizeOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    if (!_.isEmpty(ModelEntity)) {
      const collectRoleIds = _.map(ModelEntity, 'RoleId')
      const uniqRoleIds = [...new Set(collectRoleIds)]

      const getRoles = await Role.findAll({
        where: { id: { [Op.in]: uniqRoleIds } },
      })

      if (!_.isEmpty(getRoles)) {
        const collectRoles = _.map(getRoles, 'name')
        const getName = collectRoles.join(', ')

        const message = i18nConfig.t('errors.isBeingUsed', i18nOpt)
        throw new ResponseError.BadRequest(
          `Role ${getName} ${message} ${target}`
        )
      }
    }
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

    if (isForce) {
      // check when delete role is being used in users
      const getUsers = await UserService.findByRoleIds([id])
      await this.validateDelete(getUsers, 'User')
    }

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

    if (isForce) {
      // check when delete role is being used in users
      const getUsers = await UserService.findByRoleIds(ids)
      await this.validateDelete(getUsers, 'User')
    }

    await Role.destroy({
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

    await Role.restore({
      where: { id: { [Op.in]: ids } },
    })
  }
}

export default RoleService
