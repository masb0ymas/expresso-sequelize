import models from '@database/models'
import { FCMTokenAttributes, FCMTokenInstance } from '@database/models/fcmtoken'
import db from '@database/models/_instance'
import { validateBoolean, validateUUID } from '@expresso/helpers/Formatter'
import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { DtoFindAll } from '@expresso/modules/SqlizeQuery/interface'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import _ from 'lodash'
import { Includeable, Order, Transaction, WhereOptions } from 'sequelize'
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

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findByPk(
    id: string,
    options?: {
      include?: Includeable | Includeable[]
      order?: Order
      paranoid?: boolean
    }
  ): Promise<FCMTokenInstance> {
    const newId = validateUUID(id)
    const data = await FCMToken.findByPk(newId, {
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'fcm token data not found or has been deleted'
      )
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
    options?: {
      include?: Includeable | Includeable[]
      order?: Order
      paranoid?: boolean
    }
  ): Promise<FCMTokenInstance> {
    const data = await FCMToken.findOne({
      where: condition,
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'fcm token data not found or has been deleted'
      )
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
   * @returns
   */
  public static async findByUser(UserId: string): Promise<FCMTokenInstance> {
    const data = await this.findByCondition({ UserId })

    return data
  }

  /**
   *
   * @param id
   * @param paranoid
   * @returns
   */
  public static async findById(
    id: string,
    paranoid?: boolean
  ): Promise<FCMTokenInstance> {
    const data = await this.findByPk(id, { paranoid })

    return data
  }

  /**
   *
   * @param formData
   * @param txn
   * @returns
   */
  public static async create(
    formData: FCMTokenAttributes,
    txn?: Transaction
  ): Promise<FCMTokenInstance> {
    const value = useValidation(fcmTokenSchema.create, formData)
    const data = await FCMToken.create(value, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @param txn
   * @returns
   */
  public static async update(
    id: string,
    formData: Partial<FCMTokenAttributes>,
    txn?: Transaction
  ): Promise<FCMTokenInstance> {
    const data = await this.findByPk(id)

    const value = useValidation(fcmTokenSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value ?? {}, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   * @param force
   */
  public static async delete(id: string, force?: boolean): Promise<void> {
    const isForce = validateBoolean(force)

    const data = await this.findByPk(id)
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   */
  public static async restore(id: string): Promise<void> {
    const data = await this.findByPk(id, { paranoid: false })

    await data.restore()
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   * @param force
   */
  public static async multipleDelete(
    ids: string[],
    force?: boolean
  ): Promise<void> {
    const isForce = validateBoolean(force)

    if (_.isEmpty(ids)) {
      throw new ResponseError.BadRequest('ids cannot be empty')
    }

    await FCMToken.destroy({
      where: { id: { [Op.in]: ids } },
      force: isForce,
    })
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   */
  public static async multipleRestore(ids: string[]): Promise<void> {
    if (_.isEmpty(ids)) {
      throw new ResponseError.BadRequest('ids cannot be empty')
    }

    await FCMToken.restore({
      where: { id: { [Op.in]: ids } },
    })
  }

  /**
   *
   * @param formData
   * @param txn
   */
  public static async createOrUpdate(
    formData: FCMTokenAttributes,
    txn?: Transaction
  ): Promise<void> {
    const data = await FCMToken.findOne({ where: { UserId: formData.UserId } })

    if (!data) {
      await this.create(formData, txn)
    } else {
      await data.update(formData, { transaction: txn })
    }
  }
}

export default FcmTokenService
