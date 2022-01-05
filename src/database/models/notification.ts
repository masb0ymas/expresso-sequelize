import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'
import db from './_instance'

// entity
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

// creation attributes
interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, 'id'> {}

// instance
export interface NotificationInstance
  extends Model<NotificationAttributes, NotificationCreationAttributes>,
    NotificationAttributes {}

// class entity
class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  declare id: string
  declare UserId?: string | undefined
  declare title: string
  declare text: string
  declare html: string
  declare type: string
  declare isRead?: boolean | null | undefined
  declare sendAt?: Date | null | undefined
  declare isSend?: boolean | null | undefined

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
  declare readonly deletedAt: Date
}

// init model
Notification.init(
  {
    ...SequelizeAttributes.Notifications,
  },
  // @ts-expect-error
  { sequelize: db.sequelize, tableName: 'Notifications', paranoid: true }
)

export default Notification
