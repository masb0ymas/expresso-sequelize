/* eslint-disable no-unused-vars */
import models from 'models'
import ResponseError from 'modules/ResponseError'
import useValidation from 'helpers/useValidation'
import { RoleAttributes } from 'models/role'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from './schema'

const { Role } = models

class RoleService {
  /**
   * Get All Role
   */
  public static async getAll(req: any) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
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

    return { data, total }
  }

  /**
   * Get One Role
   */
  public static async getOne(id: string) {
    const data = await Role.findByPk(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return data
  }

  /**
   * Create Role
   */
  public static async create(formData: RoleAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Role.create(value)

    return { message: 'Data sudah ditambahkan!', data }
  }

  /**
   * Update Role By Id
   */
  public static async update(id: string, formData: RoleAttributes) {
    const data = await this.getOne(id)

    const value = useValidation(schema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value || {})

    return { message: 'Data berhasil diperbarui!', data }
  }

  /**
   * Delete Role By Id
   */
  public static async delete(id: string) {
    const data = await this.getOne(id)
    await data.destroy()

    return { message: 'Data berhasil dihapus!' }
  }
}

export default RoleService
