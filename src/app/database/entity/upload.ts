import { Column, DataType, DeletedAt, Table } from 'sequelize-typescript'
import { Base } from './base'

@Table({ tableName: 'upload', paranoid: true })
export class Upload extends Base {
  @DeletedAt
  @Column
  deleted_at?: Date

  @Column({ allowNull: false })
  keyfile: string

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
