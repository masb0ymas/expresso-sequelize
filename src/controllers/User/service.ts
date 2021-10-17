import models from '@database/models/index'
import { UserAttributes, UserInstance } from '@database/models/user'
import db from '@database/models/_instance'
import Excel from '@expresso/helpers/Excel'
import { validateBoolean, validateUUID } from '@expresso/helpers/Formatter'
import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { DtoFindAll } from '@expresso/modules/SqlizeQuery/interface'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import _ from 'lodash'
import { Transaction } from 'sequelize'
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
    const { filtered } = req.getQuery()
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

    return { message: `${total} data has been received.`, data, total }
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
  ): Promise<UserInstance> {
    const newId = validateUUID(id)
    const data = await User.findByPk(newId, { include: including, paranoid })

    if (!data) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

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
    paranoid?: boolean
  ): Promise<UserInstance> {
    const newId = validateUUID(id)
    const data = await User.findByPk(newId, {
      include: includeSession,
      paranoid,
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param email
   * @returns
   */
  public static async validateEmail(email: string): Promise<null> {
    const data = await User.findOne({ where: { email } })

    if (data) {
      throw new ResponseError.BadRequest('Email address already in use')
    }

    return null
  }

  /**
   *
   * @param formData
   * @param txn
   * @returns
   */
  public static async create(
    formData: UserAttributes,
    txn?: Transaction
  ): Promise<UserInstance> {
    const value = useValidation(userSchema.register, formData)
    const data = await User.create(value, { transaction: txn })

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
    formData: Partial<UserAttributes>,
    txn?: Transaction
  ): Promise<UserInstance> {
    const data = await this.findById(id)

    const value = useValidation(userSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

    if (value.email !== data.email) {
      await this.validateEmail(value.email)
    }

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

    const data = await this.findById(id)
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   */
  public static async restore(id: string): Promise<void> {
    const data = await this.findById(id, false)

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

    await User.destroy({
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
