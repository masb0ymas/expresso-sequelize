import { AppDataSource } from '../database/connection'
import { Role } from '../database/entity/role'
import { roleSchema } from '../database/schema/role'
import BaseService from './base'

export default class RoleService extends BaseService<Role> {
  constructor() {
    super({
      repository: AppDataSource.getRepository(Role),
      schema: roleSchema,
      model: 'role',
    })
  }
}
