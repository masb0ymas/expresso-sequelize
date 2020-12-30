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
   * @param arrayFormData - formData array []
   * @param txn - Transaction
   */
  public static async bulkCreate(
    arrayFormData: UserRoleAttributes[],
    txn?: Transaction
  ) {
    const newFormData = []
    if (Array.isArray(arrayFormData)) {
      for (let i = 0; i < arrayFormData.length; i += 1) {
        const formData = arrayFormData[i]

        const value = useValidation(schema.create, formData)
        newFormData.push(value)
      }
    }

    const data = await UserRole.bulkCreate(newFormData, {
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
          [Op.in]: [id],
        },
      },
    })
  }

  /**
   *
   * @param id
   * @param Roles Array of String
   * @example
   * Roles = ['id_1', 'id_2']
   */
  public static async deleteNotInRoleId(id: string, Roles: []) {
    await UserRole.destroy({
      where: {
        UserId: id,
        RoleId: {
          [Op.notIn]: Roles,
        },
      },
    })
  }
}

export default UserRoleService
