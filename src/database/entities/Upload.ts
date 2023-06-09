import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript'
import Base, { type IBaseEntity } from './Base'

interface UploadEntity extends IBaseEntity {
  deleted_at?: Date | null
  key_file: string
  filename: string
  mimetype: string
  size: number
  signed_url: string
  expiry_date_url: Date
}

export type UploadAttributes = Omit<
  UploadEntity,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

@Table({ tableName: 'upload', paranoid: true })
class Upload extends Base {
  @DeletedAt
  @Column
  deleted_at?: Date

  @Column({ allowNull: false })
  key_file: string

  @Column({ allowNull: false })
  filename: string

  @Column({ allowNull: false })
  mimetype: string

  @Column({ type: DataType.INTEGER, allowNull: false })
  size: number

  @Column({ type: DataType.TEXT, allowNull: false })
  signed_url: string

  @Column({ allowNull: false })
  expiry_date_url: Date
}

export default Upload
