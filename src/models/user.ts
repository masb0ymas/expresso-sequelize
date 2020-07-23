// eslint-disable-next-line no-unused-vars
import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

// console.log(Object.keys(SequelizeAttributes.current.Provinsis))
interface UserAttributes {
  id: string
  fullName: string
  email: string
  password: string
  phone: string
  RoleId: string
  createdAt: Date
  updatedAt: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

const User = db.sequelize.define<UserInstance>('Users', {
  ...SequelizeAttributes.Users,
})

export default User
