import { validateBoolean } from '@expresso/helpers/Common'
import useValidation from '@expresso/hooks/useValidation'
import models from 'models'
import { UserRoleAttributes } from 'models/userrole'
import db from 'models/_instance'
import { Transaction } from 'sequelize/types'
import userRoleSchema from './schema'

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
    const values = useValidation(userRoleSchema.create, formData)
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

        const value = useValidation(userRoleSchema.create, formData)
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
    const values = useValidation(userRoleSchema.create, formData)

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
    Roles: Array<string>,
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
