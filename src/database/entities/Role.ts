import { Column, DeletedAt, Table } from 'sequelize-typescript'
import Base, { BaseEntity } from './Base'

interface RoleEntity extends BaseEntity {
  name: string
}

export type RoleAttributes = Omit<
  RoleEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'role', paranoid: true })
class Role extends Base {
  @DeletedAt
  @Column
  deletedAt?: Date

  @Column
  name: string
}

export default Role
