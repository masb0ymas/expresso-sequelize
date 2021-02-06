import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface RoleAttributes {
  id: string
  name: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

export interface RoleInstance
  extends Model<RoleAttributes, RoleCreationAttributes>,
    RoleAttributes {}

const Role = db.sequelize.define<RoleInstance>(
  'Roles',
  {
    ...SequelizeAttributes.Roles,
  },
  { paranoid: true }
)

export default Role
