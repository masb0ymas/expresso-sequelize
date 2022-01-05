import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'
import db from './_instance'

// entity
export interface UploadAttributes {
  id?: string
  keyFile: string
  filename: string
  mimetype: string
  size: number
  signedUrl: string
  expiryDateUrl: Date
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

// creation attributes
interface UploadCreationAttributes extends Optional<UploadAttributes, 'id'> {}

// instance
export interface UploadInstance
  extends Model<UploadAttributes, UploadCreationAttributes>,
    UploadAttributes {}

// class entity
class Upload
  extends Model<UploadAttributes, UploadCreationAttributes>
  implements UploadAttributes
{
  declare id: string
  declare keyFile: string
  declare filename: string
  declare mimetype: string
  declare size: number
  declare signedUrl: string
  declare expiryDateUrl: Date

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
  declare readonly deletedAt: Date
}

// init model
Upload.init(
  {
    ...SequelizeAttributes.Uploads,
  },
  // @ts-expect-error
  { sequelize: db.sequelize, tableName: 'Uploads', paranoid: true }
)

export default Upload
