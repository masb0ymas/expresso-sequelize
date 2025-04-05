import { Column, DeletedAt, Table } from 'sequelize-typescript'
import BaseSchema from './base'

@Table({ tableName: 'role', paranoid: true })
export default class Role extends BaseSchema {
  @DeletedAt
  @Column
  deleted_at?: Date

  @Column({ allowNull: false })
  name: string
}
