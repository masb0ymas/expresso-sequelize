import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import Base, { BaseEntity } from './Base'
import User from './User'

interface SessionEntity extends BaseEntity {
  UserId: string
  token: string
  ipAddress?: string | null
  device?: string | null
  platform?: string | null
}

export type SessionAttributes = Omit<
  SessionEntity,
  'id' | 'createdAt' | 'updatedAt'
>

@Table({ tableName: 'session' })
class Session extends Base {
  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  UserId: string

  @BelongsTo(() => User)
  User: User

  @Column({ type: DataType.TEXT, allowNull: false })
  token: string

  @Column
  ipAddress?: string

  @Column
  device?: string

  @Column
  platform?: string
}

export default Session
