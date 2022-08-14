import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript'
import BaseEntity from './Base'

interface UploadEntity {
  id?: string
  keyFile: string
  filename: string
  mimetype: string
  size: number
  signedURL: string
  expiryDateURL: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type UploadAttributes = Omit<
  UploadEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'upload', paranoid: true })
class Upload extends BaseEntity {
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
