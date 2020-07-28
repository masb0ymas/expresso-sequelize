import Role from './role'
import User from './user'
import UserRole from './userrole'

export default {
  Role,
  User,
  UserRole,
}

/*
  Models Association
*/

User.belongsToMany(Role, { through: UserRole })
