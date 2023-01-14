import {
  Column,
  CreatedAt,
  DataType,
  Index,
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
  @Index
  @IsUUID(4)
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string

  @Index
  @CreatedAt
  @Column
  createdAt!: Date

  @Index
  @UpdatedAt
  @Column
  updatedAt!: Date
}

export default Base
