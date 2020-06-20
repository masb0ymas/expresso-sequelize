/* eslint-disable no-unused-vars */
import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import db from '.';

const { sequelize } = db;

export interface iUser {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  RoleId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model {
  public id!: string;

  public fullName!: string | null;

  public email!: string | null;

  public password!: string | null;

  public phone!: string | null;

  public RoleId!: string | null;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    RoleId: DataTypes.UUID,
  },
  {
    sequelize,
    tableName: 'Users',
  }
);

export default User;
