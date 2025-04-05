import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Table } from 'sequelize-typescript'
import { User } from './user'
import { BaseSchema } from './base'

@Table({ tableName: 'session' })
export class Session extends BaseSchema {
  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  user_id: string

  @BelongsTo(() => User)
  user: User

  @Column({ type: DataType.TEXT, allowNull: false })
  token: string

  @Column({ allowNull: true })
  ip_address?: string

  @Column({ allowNull: true })
  device?: string

  @Column({ allowNull: true })
  platform?: string

  @Column({ type: DataType.TEXT, allowNull: true })
  user_agent?: string

  @Column({ allowNull: true })
  latitude?: string

  @Column({ allowNull: true })
  longitude?: string
}
