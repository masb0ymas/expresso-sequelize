import Role from './role'
import User from './user'
import UserRole from './userrole'

export interface FilterAttributes {
  id: string
  value: string
}

export interface SortAttributes {
  id: string
  desc: string
}

export interface FilterQueryAttributes {
  page: string | number
  pageSize: string | number
  filtered: string
  sorted: string
}

export default {
  Role,
  User,
  UserRole,
}

/*
  Models Association
*/

User.belongsToMany(Role, { through: UserRole })
