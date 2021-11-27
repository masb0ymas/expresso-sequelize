import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'
import db from './_instance'

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

interface UploadCreationAttributes extends Optional<UploadAttributes, 'id'> {}

export interface UploadInstance
  extends Model<UploadAttributes, UploadCreationAttributes>,
    UploadAttributes {}

const Upload = db.sequelize.define<UploadInstance>(
  'Uploads',
  {
    ...SequelizeAttributes.Uploads,
  },
  { paranoid: true }
)

export default Upload
