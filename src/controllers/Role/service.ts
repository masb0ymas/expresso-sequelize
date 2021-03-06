import { Request } from 'express'
import models from 'models'
import db from 'models/_instance'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { RoleAttributes } from 'models/role'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Role/schema'
import Excel from 'helpers/Excel'
import { isEmpty } from 'lodash'
import { validateBoolean } from 'helpers/Common'
import { FileAttributes } from 'interfaces/file'

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
   * @param paranoid
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
   * @param fieldFiles
   */
  public static async importExcel(fieldFiles: FileAttributes) {
    const excelJson = Excel.convertToJson(fieldFiles.path)

    return excelJson
  }

  /**
   *
   * @param req - Request
   */
  public static async generateExcel(req: Request) {
    const { data } = await this.getAll(req)
    const roleData = JSON.parse(JSON.stringify(data))

    const header = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Name', key: 'name', width: 20 },
    ]

    const newData = []
    for (let i = 0; i < roleData.length; i += 1) {
      const item = roleData[i]
      newData.push({
        ...item,
      })
    }

    const stream: Buffer = await Excel.generate(header, newData)

    return stream
  }

  /**
   *
   * @param id - Force Delete
   */
  public static async delete(id: string, force?: boolean) {
    const isForce = validateBoolean(force)

    const data = await this.getOne(id)
    await data.destroy({ force: isForce })
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
   * @param force - Force Deleted
   * @example ids = ["id_1", "id_2"]
   */
  public static async multipleDelete(ids: Array<string>, force?: boolean) {
    const isForce = validateBoolean(force)

    if (isEmpty(ids)) {
      throw new ResponseError.BadRequest('ids cannot be empty')
    }

    await Role.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      force: isForce,
    })
  }

  /**
   *
   * @param ids
   * @example ids = ["id_1", "id_2"]
   */
  public static async multipleRestore(ids: Array<string>) {
    if (isEmpty(ids)) {
      throw new ResponseError.BadRequest('ids cannot be empty')
    }

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
