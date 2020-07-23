// eslint-disable-next-line no-unused-vars
import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

interface RoleAttributes {
  id: string
  nama: string
  createdAt?: Date
  updatedAt?: Date
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

interface RoleInstance
  extends Model<RoleAttributes, RoleCreationAttributes>,
    RoleAttributes {}

const Role = db.sequelize.define<RoleInstance>('Roles', {
  ...SequelizeAttributes.Roles,
})

export default Role
