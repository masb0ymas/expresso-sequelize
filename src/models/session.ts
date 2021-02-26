import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface SessionAttributes {
  id?: string
  UserId: string
  token: string
  ipAddress?: string | null
  device?: string | null
  platform?: string | null
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> {}

export interface SessionInstance
  extends Model<SessionAttributes, SessionCreationAttributes>,
    SessionAttributes {}

const Session = db.sequelize.define<SessionInstance>('Sessions', {
  ...SequelizeAttributes.Sessions,
})

export default Session
