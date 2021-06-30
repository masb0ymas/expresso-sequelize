import { validateBoolean } from '@expresso/helpers/Common'
import Excel from '@expresso/helpers/Excel'
import useValidation from '@expresso/hooks/useValidation'
import { FileAttributes } from '@expresso/interfaces/file'
import ResponseError from '@expresso/modules/Response/ResponseError'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { isEmpty } from 'lodash'
import models from 'models'
import { HobbyAttributes } from 'models/hobby'
import db from 'models/_instance'
import hobbySchema from './schema'

const { Sequelize } = db
const { Op } = Sequelize

const { Hobby } = models

class HobbyService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Hobby,
      []
    )

    const data = await Hobby.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Hobby.count({
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
    const data = await Hobby.findByPk(id, { paranoid })

    if (!data) {
      throw new ResponseError.NotFound(
        'hobby data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: HobbyAttributes) {
    const value = useValidation(hobbySchema.create, formData)
    const data = await Hobby.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: HobbyAttributes) {
    const data = await this.getOne(id)

    const value = useValidation(hobbySchema.create, {
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

    await Hobby.destroy({
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

    await Hobby.restore({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
  }
}

export default HobbyService
