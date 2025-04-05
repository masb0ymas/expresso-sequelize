import { Column, DeletedAt, Table } from 'sequelize-typescript'
import { Base } from './base'

@Table({ tableName: 'role', paranoid: true })
export class Role extends Base {
  @DeletedAt
  @Column
  deleted_at?: Date

  @Column({ allowNull: false })
  name: string
}
