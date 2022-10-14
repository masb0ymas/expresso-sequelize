import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import Role, { RoleAttributes } from '@database/entities/Role'
import { validateBoolean, validateUUID } from '@expresso/helpers/Formatter'
import { optionsYup } from '@expresso/helpers/Validation'
import { DtoFindAll } from '@expresso/interfaces/Paginate'
import { ReqOptions } from '@expresso/interfaces/ReqOptions'
import ResponseError from '@expresso/modules/Response/ResponseError'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { Op } from 'sequelize'
import roleSchema from './schema'

class RoleService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoFindAll<Role>> {
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

    const message = i18nConfig.t('success.data_received', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: ReqOptions
  ): Promise<Role> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await Role.findOne({
      where: { id: newId },
      paranoid: options?.isParanoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`role ${message}`)
    }

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(formData: RoleAttributes): Promise<Role> {
    const value = roleSchema.create.validateSync(formData, optionsYup)

    const data = await Role.create(value)

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
    options?: ReqOptions
  ): Promise<Role> {
    const data = await this.findById(id, { ...options })

    const value = roleSchema.create.validateSync(
      { ...data, ...formData },
      optionsYup
    )

    const newData = await data.update({ ...data, ...value })

    return newData
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async restore(id: string, options?: ReqOptions): Promise<void> {
    const data = await this.findById(id, { isParanoid: false, ...options })
    await data.restore()
  }

  /**
   *
   * @param id
   * @param options
   */
  private static async delete(id: string, options?: ReqOptions): Promise<void> {
    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.isForce)

    const data = await this.findById(id, { ...options })
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async softDelete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    // soft delete
    await this.delete(id, options)
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async forceDelete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    // force delete
    await this.delete(id, { isForce: true, ...options })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static validateIds(ids: string[], options?: ReqOptions): void {
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
    this.validateIds(ids, options)

    await Role.restore({
      where: { id: { [Op.in]: ids } },
    })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static async multipleDelete(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    // validate empty ids
    this.validateIds(ids, options)

    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.isForce)

    await Role.destroy({
      where: { id: { [Op.in]: ids } },
      force: isForce,
    })
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
    await this.multipleDelete(ids, options)
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
    await this.multipleDelete(ids, { isForce: true, ...options })
  }
}

export default RoleService
