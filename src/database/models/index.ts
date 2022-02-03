import FCMToken from './fcmtoken'
import Notification from './notification'
import Role from './role'
import Session from './session'
import Upload from './upload'
import User from './user'

const models = {
  Role,
  User,
  Session,
  Upload,
  Notification,
  FCMToken,
}

// relation
User.belongsTo(Role)
User.hasMany(Session)

Notification.belongsTo(User)

Session.belongsTo(User)

export default models

// export type MyModels = typeof models

// Object.entries(models).map(([, model]) => {
//   if (model?.associate) {
//     model.associate(models)
//   }
//   return model
// })
