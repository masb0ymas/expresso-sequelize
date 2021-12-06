import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'
import db from './_instance'

export interface FCMTokenAttributes {
  id?: string
  UserId: string
  token: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

interface FCMTokenCreationAttributes
  extends Optional<FCMTokenAttributes, 'id'> {}

export interface FCMTokenInstance
  extends Model<FCMTokenAttributes, FCMTokenCreationAttributes>,
    FCMTokenAttributes {}

const FCMToken = db.sequelize.define<FCMTokenInstance>(
  'FCMTokens',
  {
    ...SequelizeAttributes.FCMTokens,
  },
  { paranoid: true }
)

export default FCMToken
