import models from 'models'
import db from 'models/_instance'
import useValidation from 'helpers/useValidation'
import { Transaction } from 'sequelize/types'
import { UserRoleAttributes } from 'models/userrole'
import schema from 'controllers/UserRole/schema'
import { validateBoolean } from 'helpers/Common'

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
   */
  public static async findOrCreate(formData: UserRoleAttributes) {
    const values = useValidation(schema.create, formData)

    const data = await UserRole.findOrCreate({
      where: values,
    })

    return data
  }

  /**
   *
   * @param id
   * @param force
   */
  public static async deleteByUserId(id: string, force?: boolean) {
    const isForce = validateBoolean(force)

    await UserRole.destroy({
      where: {
        UserId: {
          [Op.in]: [id],
        },
      },
      force: isForce,
    })
  }

  /**
   *
   * @param id
   * @param force
   */
  public static async deleteByUserIds(ids: Array<string>, force?: boolean) {
    const isForce = validateBoolean(force)

    await UserRole.destroy({
      where: {
        UserId: {
          [Op.in]: ids,
        },
      },
      force: isForce,
    })
  }

  /**
   *
   * @param id
   * @param Roles Array of String
   * @param force
   * @example
   * Roles = ['id_1', 'id_2']
   */
  public static async deleteNotInRoleId(
    id: string,
    Roles: [],
    force?: boolean
  ) {
    const isForce = validateBoolean(force)

    await UserRole.destroy({
      where: {
        UserId: id,
        RoleId: {
          [Op.notIn]: Roles,
        },
      },
      force: isForce,
    })
  }
}

export default UserRoleService
