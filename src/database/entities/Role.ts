import { Column, DeletedAt, Table } from 'sequelize-typescript'
import BaseEntity from './Base'

interface RoleEntity {
  id?: string
  name: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type RoleAttributes = Omit<
  RoleEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'role', paranoid: true })
class Role extends BaseEntity {
  @DeletedAt
  @Column
  deletedAt?: Date

  @Column
  name: string
}

export default Role
