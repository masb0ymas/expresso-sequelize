import Role from './role'
import User from './user'
import UserRole from './userrole'

const models = {
  Role,
  User,
  UserRole,
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  if (model?.associate) {
    model.associate(models)
  }
  return model
})
