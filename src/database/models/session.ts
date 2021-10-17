import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'
import { MyModels } from './index'
import db from './_instance'

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

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> {}

export interface SessionInstance
  extends Model<SessionAttributes, SessionCreationAttributes>,
    SessionAttributes {}

const Session = db.sequelize.define<SessionInstance>('Sessions', {
  ...SequelizeAttributes.Sessions,
})

Session.associate = (models: MyModels) => {
  Session.belongsTo(models.User)
}

export default Session
