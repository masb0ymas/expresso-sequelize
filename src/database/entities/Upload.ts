import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript'
import Base, { type BaseEntity } from './Base'

interface UploadEntity extends BaseEntity {
  deletedAt?: Date | null
  keyFile: string
  filename: string
  mimetype: string
  size: number
  signedURL: string
  expiryDateURL: Date
}

export type UploadAttributes = Omit<
  UploadEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'upload', paranoid: true })
class Upload extends Base {
  @DeletedAt
  @Column
  deletedAt?: Date

  @Column({ allowNull: false })
  keyFile: string

  @Column({ allowNull: false })
  filename: string

  @Column({ allowNull: false })
  mimetype: string

  @Column({ type: DataType.INTEGER, allowNull: false })
  size: number

  @Column({ type: DataType.TEXT, allowNull: false })
  signedURL: string

  @Column({ allowNull: false })
  expiryDateURL: Date
}

export default Upload
