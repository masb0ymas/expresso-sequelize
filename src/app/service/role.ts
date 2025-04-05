import { Model, ModelStatic } from 'sequelize'
import Role from '../database/entity/role'
import { roleSchema } from '../database/schema/role'
import BaseService from './base'

// Define a type that ensures Role is recognized as a Sequelize Model
type RoleModel = Role & Model

export default class RoleService extends BaseService<RoleModel> {
  constructor() {
    super({
      repository: Role as unknown as ModelStatic<RoleModel>,
      schema: roleSchema,
      model: 'role',
    })
  }
}
