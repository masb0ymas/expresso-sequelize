import Role, { type RoleAttributes } from '~/database/entities/Role'
import roleSchema from '../schema/role.schema'
import BaseService from './base.service'

export default class RoleService extends BaseService {
  constructor() {
    super({ entity: 'role', repository: Role })
  }

  /**
   *
   * @param formData
   * @returns
   */
  public async create(formData: RoleAttributes): Promise<Role> {
    const value = roleSchema.create.parse(formData)

    const data = await Role.create(value)
    return data
  }
}
