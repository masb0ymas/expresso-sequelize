import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import models from '@database/models'
import { FCMTokenAttributes, FCMTokenInstance } from '@database/models/fcmtoken'
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
import { WhereOptions } from 'sequelize'
import fcmTokenSchema from './schema'

const { Sequelize } = db
const { Op } = Sequelize
const { FCMToken } = models

interface DtoPaginate extends DtoFindAll {
  data: FCMTokenInstance[]
}

class FcmTokenService {
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
      FCMToken,
      []
    )

    const data = await FCMToken.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await FCMToken.count({
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
  ): Promise<FCMTokenInstance> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { lang: options?.lang })
    const data = await FCMToken.findByPk(newId, {
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.notFound', i18nOpt)
      throw new ResponseError.NotFound(`fcm token ${message}`)
    }

    return data
  }

  /**
   *
   * @param condition
   * @param options
   * @returns
   */
  public static async findByCondition(
    condition: WhereOptions<FCMTokenAttributes>,
    options?: SqlizeOptions
  ): Promise<FCMTokenInstance> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const data = await FCMToken.findOne({
      where: condition,
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.notFound', i18nOpt)
      throw new ResponseError.NotFound(`fcm token ${message}`)
    }

    return data
  }

  /**
   *
   * Get Token
   * @returns
   */
  public static async getToken(): Promise<string[]> {
    const data = await FCMToken.findAll()

    const newData = _.map(data, 'token')
    const uniqToken = _.uniq(newData)

    return uniqToken
  }

  /**
   *
   * @param UserId
   * @param options
   * @returns
   */
  public static async findByUser(
    UserId: string,
    options?: SqlizeOptions
  ): Promise<FCMTokenInstance> {
    const data = await this.findByCondition({ UserId }, { lang: options?.lang })

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
  ): Promise<FCMTokenInstance> {
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
    formData: FCMTokenAttributes,
    options?: SqlizeOptions
  ): Promise<FCMTokenInstance> {
    const value = useValidation(fcmTokenSchema.create, formData)
    const data = await FCMToken.create(value, {
      transaction: options?.transaction,
    })

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
    formData: Partial<FCMTokenAttributes>,
    options?: SqlizeOptions
  ): Promise<FCMTokenInstance> {
    const data = await this.findByPk(id, { lang: options?.lang })

    const value = useValidation(fcmTokenSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

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

    await FCMToken.destroy({
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

    await FCMToken.restore({
      where: { id: { [Op.in]: ids } },
    })
  }

  /**
   *
   * @param formData
   * @param options
   */
  public static async createOrUpdate(
    formData: FCMTokenAttributes,
    options?: SqlizeOptions
  ): Promise<void> {
    const data = await FCMToken.findOne({ where: { UserId: formData.UserId } })

    if (!data) {
      await this.create(formData, { transaction: options?.transaction })
    } else {
      await data.update(formData, { transaction: options?.transaction })
    }
  }
}

export default FcmTokenService
