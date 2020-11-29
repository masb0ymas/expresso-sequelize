import models from 'models'
import db from 'models/_instance'
import useValidation from 'helpers/useValidation'
import { Transaction } from 'sequelize/types'
import { UserRoleAttributes } from 'models/userrole'
import schema from 'controllers/UserRole/schema'

const { Sequelize } = db
const { Op } = Sequelize

const { UserRole } = models

class UserRoleService {
  /**
   *
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async create(formData: UserRoleAttributes, txn?: Transaction) {
    const values = useValidation(schema.create, formData)
    const data = await UserRole.create(values, {
      transaction: txn,
    })

    return data
  }

  /**
   *
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async findOrCreate(
    formData: UserRoleAttributes,
    txn?: Transaction
  ) {
    const values = useValidation(schema.create, formData)

    const data = await UserRole.findOrCreate({
      where: values,
    })

    return data
  }

  /**
   *
   * @param id
   */
  public static async deleteByUserId(id: string) {
    await UserRole.destroy({
      where: {
        UserId: {
          [Op.in]: id,
        },
      },
    })
  }

  /**
   *
   * @param id
   * @param roles Array of String
   * @example
   * roles = ['id_1', 'id_2']
   */
  public static async deleteNotInRoleId(id: string, roles: []) {
    await UserRole.destroy({
      where: {
        UserId: id,
        RoleId: {
          [Op.notIn]: roles,
        },
      },
    })
  }
}

export default UserRoleService
