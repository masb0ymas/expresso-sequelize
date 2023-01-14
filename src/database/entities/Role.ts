import { Column, DeletedAt, Index, Table } from 'sequelize-typescript'
import Base, { BaseEntity } from './Base'

interface RoleEntity extends BaseEntity {
  deletedAt?: Date | null
  name: string
}

export type RoleAttributes = Omit<
  RoleEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'role', paranoid: true })
class Role extends Base {
  @Index
  @DeletedAt
  @Column
  deletedAt?: Date

  @Index
  @Column
  name: string
}

export default Role
