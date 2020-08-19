/* eslint-disable no-unused-vars */
import models from 'models'
import useValidation from 'helpers/useValidation'
import { Transaction } from 'sequelize/types'
import { UserRoleAttributes } from 'models/userrole'
import schema from './schema'

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
}

export default UserRoleService
