import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import models from 'models'
import { SessionAttributes } from 'models/session'
import { Transaction } from 'sequelize'
import sessionSchema from './schema'

const { Session, User } = models
const including = [{ model: User }]

class SessionService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request) {
    const { filtered } = req.getQuery()
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Session,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Session.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Session.count({
      include: includeCount,
      where: queryFind.where,
    })

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   *
   * @param id
   */
  public static async getOne(id: string) {
    const data = await Session.findByPk(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'session data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param UserId
   * @param token
   */
  public static async findByTokenUser(UserId: string, token: string) {
    const data = await Session.findOne({ where: { UserId, token } })

    if (!data) {
      throw new ResponseError.NotFound(
        'the login session has ended, please re-login'
      )
    }

    return data
  }

  /**
   *
   * @param formData
   * @param txn - Transaction
   */
  public static async create(formData: SessionAttributes, txn?: Transaction) {
    const value = useValidation(sessionSchema.create, formData)
    const data = await Session.create(value, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: SessionAttributes) {
    const data = await this.getOne(id)

    const value = useValidation(sessionSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value || {})

    return data
  }

  /**
   *
   * @param formData
   * @param txn - Transaction
   */
  public static async createOrUpdate(
    formData: SessionAttributes,
    txn?: Transaction
  ) {
    const data = await Session.findOne({ where: { UserId: formData.UserId } })

    if (!data) {
      await this.create(formData, txn)
    } else {
      await data.update(formData, { transaction: txn })
    }
  }

  /**
   *
   * @param UserId
   * @param token
   */
  public static async deleteByTokenUser(UserId: string, token: string) {
    await Session.destroy({ where: { UserId, token } })
  }

  /**
   *
   * @param id - Force Delete
   */
  public static async delete(id: string) {
    const data = await this.getOne(id)
    await data.destroy()
  }
}

export default SessionService
