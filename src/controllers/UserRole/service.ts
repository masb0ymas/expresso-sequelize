/* eslint-disable no-unused-vars */
import models from 'models'
import db from 'models/_instance'
import useValidation from 'helpers/useValidation'
import { Transaction } from 'sequelize/types'
import { UserRoleAttributes } from 'models/userrole'
import schema from './schema'

const { Sequelize } = db
const { Op } = Sequelize

const { UserRole } = models

class UserRoleService {
  /**
   * Create User Role
   */
  public static async create(formData: UserRoleAttributes, txn?: Transaction) {
    const values = useValidation(schema.create, formData)
    const data = await UserRole.create(values, {
      transaction: txn,
    })

    return data
  }

  /**
   * Find Or Create User Role
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
   * Delete UserRole by UserId
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
   * Delete UserRole not In RoleId
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
