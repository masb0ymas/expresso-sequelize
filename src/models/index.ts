import Role from './role'
import User from './user'
import UserRole from './userrole'
import RefreshToken from './refreshtoken'
import Session from './session'

const models = {
  Role,
  User,
  UserRole,
  RefreshToken,
  Session,
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  if (model?.associate) {
    model.associate(models)
  }
  return model
})
