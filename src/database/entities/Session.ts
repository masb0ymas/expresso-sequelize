import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import Base, { type IBaseEntity } from './Base'
import User from './User'

interface SessionEntity extends IBaseEntity {
  user_id: string
  token: string
  ip_address?: string | null
  device?: string | null
  platform?: string | null
  latitude?: string | null
  longitude?: string | null
}

export type SessionAttributes = Omit<
  SessionEntity,
  'id' | 'created_at' | 'updated_at'
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
  user_id: string

  @BelongsTo(() => User)
  user: User

  @Column({ type: DataType.TEXT, allowNull: false })
  token: string

  @Column
  ip_address?: string

  @Column
  device?: string

  @Column
  platform?: string

  @Column
  latitude?: string

  @Column
  longitude?: string
}

export default Session
