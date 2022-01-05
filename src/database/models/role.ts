import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'
import db from './_instance'

// entity
export interface RoleAttributes {
  id: string
  name: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

// creation attributes
interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

// instance
export interface RoleInstance
  extends Model<RoleAttributes, RoleCreationAttributes>,
    RoleAttributes {}

// class entity
class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  declare id: string
  declare name: string

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
  declare readonly deletedAt: Date
}

// init model
Role.init(
  {
    ...SequelizeAttributes.Roles,
  },
  // @ts-expect-error
  { sequelize: db.sequelize, tableName: 'Roles', paranoid: true }
)

export default Role
