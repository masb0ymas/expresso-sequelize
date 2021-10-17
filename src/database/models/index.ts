import Role from './role'
import Session from './session'
import User from './user'

const models = {
  Role,
  User,
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
