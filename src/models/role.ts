/* eslint-disable no-unused-vars */
import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize'
import db from '.'

const { sequelize } = db

class Role extends Model {
  public id!: string

  public nama!: string | null

  public readonly createdAt!: Date

  public readonly updatedAt!: Date
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    nama: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: 'Roles',
  }
)

export default Role
