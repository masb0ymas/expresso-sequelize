import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'
import db from './_instance'

// entity
export interface FCMTokenAttributes {
  id?: string
  UserId: string
  token: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

// creation attributes
interface FCMTokenCreationAttributes
  extends Optional<FCMTokenAttributes, 'id'> {}

// instance
export interface FCMTokenInstance
  extends Model<FCMTokenAttributes, FCMTokenCreationAttributes>,
    FCMTokenAttributes {}

// class entity
class FCMToken
  extends Model<FCMTokenAttributes, FCMTokenCreationAttributes>
  implements FCMTokenAttributes
{
  declare id: string
  declare UserId: string
  declare token: string

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
  declare readonly deletedAt: Date
}

// init model
FCMToken.init(
  {
    ...SequelizeAttributes.FCMTokens,
  },
  // @ts-expect-error
  { sequelize: db.sequelize, tableName: 'FCMTokens', paranoid: true }
)

export default FCMToken
