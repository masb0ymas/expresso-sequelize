import models from '@database/models/index'
import { RoleAttributes, RoleInstance } from '@database/models/role'
import db from '@database/models/_instance'
import { validateBoolean, validateUUID } from '@expresso/helpers/Formatter'
import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { DtoFindAll } from '@expresso/modules/SqlizeQuery/interface'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import _ from 'lodash'
import { Transaction } from 'sequelize'
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
  ): Promise<RoleInstance> {
    const newId = validateUUID(id)
    const data = await Role.findByPk(newId, { paranoid })

    if (!data) {
      throw new ResponseError.NotFound(
        'role data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(
    formData: RoleAttributes,
    txn?: Transaction
  ): Promise<RoleInstance> {
    const value = useValidation(roleSchema.create, formData)
    const data = await Role.create(value, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @returns
   */
  public static async update(
    id: string,
    formData: Partial<RoleAttributes>,
    txn?: Transaction
  ): Promise<RoleInstance> {
    const data = await this.findById(id)

    const value = useValidation(roleSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value ?? {}, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
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

    await Role.destroy({
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

    await Role.restore({
      where: { id: { [Op.in]: ids } },
    })
  }
}

export default RoleService
