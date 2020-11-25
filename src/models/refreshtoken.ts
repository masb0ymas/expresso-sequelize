import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface verifyRefreshTokenAttributes {
  id: string
  nama: string
  email: string
  active: boolean
}

export interface RefreshTokenAttributes {
  id?: string
  UserId: string
  token: string
  createdAt?: Date
  updatedAt?: Date
}

interface RefreshTokenCreationAttributes
  extends Optional<RefreshTokenAttributes, 'id'> {}

interface RefreshTokenInstance
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>,
    RefreshTokenAttributes {}

const RefreshToken = db.sequelize.define<RefreshTokenInstance>(
  'RefreshTokens',
  {
    ...SequelizeAttributes.RefreshTokens,
  }
)

export default RefreshToken
