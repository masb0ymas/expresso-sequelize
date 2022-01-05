import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'
import db from './_instance'

// entity
export interface SessionAttributes {
  id?: string
  UserId: string
  token: string
  ipAddress?: string | null
  device?: string | null
  platform?: string | null
  latitude?: string | null
  longitude?: string | null
  createdAt?: Date
  updatedAt?: Date
}

// creation attributes
interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> {}

// instance
export interface SessionInstance
  extends Model<SessionAttributes, SessionCreationAttributes>,
    SessionAttributes {}

// class entity
class Session
  extends Model<SessionAttributes, SessionCreationAttributes>
  implements SessionAttributes
{
  declare id: string
  declare UserId: string
  declare token: string
  declare ipAddress?: string | null | undefined
  declare device?: string | null | undefined
  declare platform?: string | null | undefined
  declare latitude?: string | null | undefined
  declare longitude?: string | null | undefined

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

// init model
Session.init(
  {
    ...SequelizeAttributes.Sessions,
  },
  // @ts-expect-error
  { sequelize: db.sequelize, tableName: 'Sessions' }
)

export default Session
