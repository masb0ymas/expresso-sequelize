import { Request } from 'express'
import models from 'models'
import db from 'models/_instance'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { UserAttributes } from 'models/user'
import { Transaction } from 'sequelize/types'
import UserRoleService from 'controllers/UserRole/service'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/User/schema'
import { arrayFormatter } from 'helpers/Common'

const { Sequelize } = db
const { Op } = Sequelize

const { User, Role } = models
const including = [{ model: Role }]

class UserService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request) {
    const { filtered } = req.query
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
   */
  public static async getOne(id: string, paranoid?: boolean) {
    const data = await User.findByPk(id, {
      include: including,
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
   * @param id
   * note: find by id only find data not include relation
   */
  public static async findById(id: string, paranoid?: boolean) {
    const data = await User.findByPk(id, { paranoid })

    if (!data) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async create(formData: UserAttributes, txn?: Transaction) {
    const { Roles }: any = formData
    const value = useValidation(schema.create, formData)

    const dataUser = await User.create(value, {
      transaction: txn,
    })

    // Check Roles is Array, format = ['id_1', 'id_2']
    const arrayRoles = arrayFormatter(Roles)

    const listUserRole = []
    for (let i = 0; i < arrayRoles.length; i += 1) {
      const RoleId: string = arrayRoles[i]
      const formData = {
        UserId: dataUser.id,
        RoleId,
      }

      listUserRole.push(formData)
    }

    await UserRoleService.bulkCreate(listUserRole, txn)

    return dataUser
  }

  /**
   *
   * @param id
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async update(
    id: string,
    formData: UserAttributes,
    txn?: Transaction
  ) {
    const data = await this.findById(id)
    const { Roles }: any = formData

    // Check Roles is Array, format = ['id_1', 'id_2']
    const arrayRoles = arrayFormatter(Roles)

    // Destroy data not in UserRole
    await UserRoleService.deleteNotInRoleId(id, arrayRoles)

    for (let i = 0; i < arrayRoles.length; i += 1) {
      const RoleId: string = arrayRoles[i]
      const formRole = {
        UserId: id,
        RoleId,
      }

      // eslint-disable-next-line no-await-in-loop
      await UserRoleService.findOrCreate(formRole, txn)
    }

    const value = useValidation(schema.update, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value || {}, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   */
  public static async delete(id: string) {
    const data = await this.getOne(id)

    await UserRoleService.deleteByUserId(id)
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

export default UserService
