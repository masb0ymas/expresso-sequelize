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

export interface IBaseEntity {
  id?: string
  created_at: Date
  updated_at: Date
}

@Table({ tableName: 'base' })
class Base extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string

  @CreatedAt
  @Column({ allowNull: false })
  created_at!: Date

  @UpdatedAt
  @Column({ allowNull: false })
  updated_at!: Date
}

export default Base
