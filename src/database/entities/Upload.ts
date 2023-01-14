import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript'
import Base, { BaseEntity } from './Base'

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

  @Column
  keyFile: string

  @Column
  filename: string

  @Column
  mimetype: string

  @Column({ type: DataType.INTEGER })
  size: number

  @Column({ type: DataType.TEXT })
  signedURL: string

  @Column
  expiryDateURL: Date
}

export default Upload
