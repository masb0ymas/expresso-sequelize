/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import models from 'models'
import db from 'models/_instance'
import ResponseError from 'modules/ResponseError'
import useValidation from 'helpers/useValidation'
import { UserAttributes } from 'models/user'
import UserRole from 'models/userrole'
import { Transaction } from 'sequelize/types'
import UserRoleService from 'controllers/UserRole/service'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from './schema'

const { Sequelize } = db
const { Op } = Sequelize

const { User, Role } = models
const including = [{ model: Role }]

class UserService {
  /**
   * Get All User
   */
  public static async getAll(req: any) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req,
      User,
      including
    )

    const data = await User.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await User.count({
      include: includeCount,
      where: queryFind.where,
    })

    return { data, total }
  }

  /**
   * Get One User
   */
  public static async getOne(id: string) {
    const data = await User.findByPk(id, {
      include: including,
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return data
  }

  /**
   * Create User
   */
  public static async create(formData: UserAttributes, txn?: Transaction) {
    const { Roles }: any = formData
    const value = useValidation(schema.create, formData)

    const dataUser = await User.create(value, {
      transaction: txn,
    })

    // Check Roles is Array, format = ['id_1', 'id_2']
    const arrayRoles = Array.isArray(Roles) ? Roles : JSON.parse(Roles)

    const listUserRole = []
    for (let i = 0; i < arrayRoles.length; i += 1) {
      const RoleId: string = arrayRoles[i]
      const formRole = {
        UserId: dataUser.id,
        RoleId,
      }
      // eslint-disable-next-line no-await-in-loop
      const dataUserRole = await UserRoleService.create(formRole, txn)
      listUserRole.push(dataUserRole)
    }

    return {
      message: 'Data sudah ditambahkan!',
      data: dataUser,
      dataUserRole: listUserRole,
    }
  }

  /**
   * Update User By Id
   */
  public static async update(
    id: string,
    formData: UserAttributes,
    txn?: Transaction
  ) {
    const data = await this.getOne(id)
    const { Roles }: any = formData

    // Check Roles is Array, format = ['id_1', 'id_2']
    const arrayRoles = Array.isArray(Roles) ? Roles : JSON.parse(Roles)

    // Destroy data not in UserRole
    await UserRole.destroy({
      where: {
        UserId: id,
        RoleId: {
          [Op.notIn]: arrayRoles,
        },
      },
    })

    const listUserRole = []
    for (let i = 0; i < arrayRoles.length; i += 1) {
      const RoleId: string = arrayRoles[i]
      const formRole = {
        UserId: id,
        RoleId,
      }
      // eslint-disable-next-line no-await-in-loop
      const dataUserRole = await UserRoleService.findOrCreate(formRole, txn)
      listUserRole.push(dataUserRole)
    }

    const value = useValidation(schema.update, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value || {}, { transaction: txn })

    return {
      message: 'Data berhasil diperbarui!',
      data,
      dataUserRole: listUserRole,
    }
  }

  /**
   * Delete User By Id
   */
  public static async delete(id: string) {
    const data = await this.getOne(id)

    // Destroy user data in UserRole
    await UserRole.destroy({
      where: {
        UserId: {
          [Op.in]: id,
        },
      },
    })

    await data.destroy()

    return {
      message: 'Data berhasil dihapus!',
    }
  }
}

export default UserService
