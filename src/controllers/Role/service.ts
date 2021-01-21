import { Request } from 'express'
import models from 'models'
import db from 'models/_instance'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { RoleAttributes } from 'models/role'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Role/schema'

const { Sequelize } = db
const { Op } = Sequelize

const { Role } = models

class RoleService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request) {
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
   */
  public static async getOne(id: string, paranoid?: boolean) {
    const data = await Role.findByPk(id, { paranoid })

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
   */
  public static async create(formData: RoleAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Role.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: RoleAttributes) {
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
   * @param id - Delete Forever
   */
  public static async delete(id: string) {
    const data = await this.getOne(id)
    await data.destroy({ force: true })
  }

  /**
   *
   * @param id - Soft Delete
   */
  public static async softDelete(id: string) {
    const data = await this.getOne(id)
    await data.destroy()
  }

  /**
   *
   * @param id - Restore data from Trash
   */
  public static async restore(id: string) {
    const data = await this.getOne(id, false)
    await data.restore()
  }

  /**
   *
   * @param ids
   * @example ["id_1", "id_2"]
   */
  public static async multipleDelete(ids: Array<string>) {
    await Role.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
  }

  /**
   *
   * @param ids
   * @example ["id_1", "id_2"]
   */
  public static async multipleRestore(ids: Array<string>) {
    await Role.restore({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
  }
}

export default RoleService
