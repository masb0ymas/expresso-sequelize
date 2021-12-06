import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'
import { MyModels } from './index'
import db from './_instance'

export interface NotificationAttributes {
  id?: string
  UserId?: string
  title: string
  text: string
  html: string
  type: string
  isRead?: boolean | null
  sendAt?: Date | null
  isSend?: boolean | null
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, 'id'> {}

export interface NotificationInstance
  extends Model<NotificationAttributes, NotificationCreationAttributes>,
    NotificationAttributes {}

const Notification = db.sequelize.define<NotificationInstance>(
  'Notifications',
  {
    ...SequelizeAttributes.Notifications,
  },
  { paranoid: true }
)

Notification.associate = (models: MyModels) => {
  Notification.belongsTo(models.User)
}

export default Notification
