import { Request } from 'express'
import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Session/schema'
import { SessionAttributes } from 'models/session'

const { Session } = models

class SessionService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Session,
      []
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
   */
  public static async create(formData: SessionAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Session.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: SessionAttributes) {
    const data = await this.getOne(id)

    const value = useValidation(schema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value || {})

    return data
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
