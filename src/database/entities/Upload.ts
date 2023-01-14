import { Column, DataType, DeletedAt, Index, Table } from 'sequelize-typescript'
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
  @Index
  @DeletedAt
  @Column
  deletedAt?: Date

  @Index
  @Column
  keyFile: string

  @Index
  @Column
  filename: string

  @Column
  mimetype: string

  @Column({ type: DataType.INTEGER })
  size: number

  @Index
  @Column({ type: DataType.TEXT })
  signedURL: string

  @Index
  @Column
  expiryDateURL: Date
}

export default Upload
