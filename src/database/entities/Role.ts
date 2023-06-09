import { Column, DeletedAt, Table } from 'sequelize-typescript'
import Base, { type IBaseEntity } from './Base'

interface RoleEntity extends IBaseEntity {
  deleted_at?: Date | null
  name: string
}

export type RoleAttributes = Omit<
  RoleEntity,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

@Table({ tableName: 'role', paranoid: true })
class Role extends Base {
  @DeletedAt
  @Column
  deleted_at?: Date

  @Column({ allowNull: false })
  name: string
}

export default Role
