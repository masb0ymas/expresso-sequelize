import models from '@database/models/index'
import { SessionAttributes, SessionInstance } from '@database/models/session'
import { validateUUID } from '@expresso/helpers/Formatter'
import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { DtoFindAll } from '@expresso/modules/SqlizeQuery/interface'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { Transaction } from 'sequelize'
import sessionSchema from './schema'

const { Session, User } = models
const including = [{ model: User }]

interface DtoPaginate extends DtoFindAll {
  data: SessionInstance[]
}

class SessionService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
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
   * @returns
   */
  public static async findById(id: string): Promise<SessionInstance> {
    const newId = validateUUID(id)
    const data = await Session.findByPk(newId)

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
   * @returns
   */
  public static async findByUserToken(
    UserId: string,
    token: string
  ): Promise<SessionInstance> {
    const data = await Session.findOne({ where: { UserId, token } })

    if (!data) {
      throw new ResponseError.Unauthorized(
        'the login session has ended, please re-login'
      )
    }

    return data
  }

  /**
   *
   * @param formData
   * @param txn
   * @returns
   */
  public static async create(
    formData: SessionAttributes,
    txn?: Transaction
  ): Promise<SessionInstance> {
    const value = useValidation(sessionSchema.create, formData)
    const data = await Session.create(value, { transaction: txn })

    return data
  }

  /**
   *
   * @param formData
   * @param txn
   */
  public static async createOrUpdate(
    formData: SessionAttributes,
    txn?: Transaction
  ): Promise<void> {
    const value = useValidation(sessionSchema.create, formData)
    const data = await Session.findOne({ where: { UserId: value.UserId } })

    if (!data) {
      await this.create(formData, txn)
    } else {
      await data.update(value, { transaction: txn })
    }
  }

  /**
   *
   * @param UserId
   * @param token
   */
  public static async deleteByUserToken(
    UserId: string,
    token: string
  ): Promise<void> {
    await Session.destroy({ where: { UserId, token } })
  }

  /**
   *
   * @param id
   */
  public static async delete(id: string): Promise<void> {
    const data = await this.findById(id)
    await data.destroy()
  }
}

export default SessionService
