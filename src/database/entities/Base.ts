import {
  Column,
  CreatedAt,
  DataType,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

export interface BaseEntity {
  id?: string
  createdAt: Date
  updatedAt: Date
}

@Table({ tableName: 'base' })
class Base extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string

  @CreatedAt
  @Column({ allowNull: false })
  createdAt!: Date

  @UpdatedAt
  @Column({ allowNull: false })
  updatedAt!: Date
}

export default Base
