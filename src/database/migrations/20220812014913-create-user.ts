'use strict'

import { DataTypes, QueryInterface } from 'sequelize'

export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.createTable('user', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
    fullname: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING('20'),
    },
    token_verify: {
      type: Sequelize.TEXT,
    },
    is_active: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    is_blocked: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    role_id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      references: {
        model: 'role',
        key: 'id',
      },
    },
    upload_id: {
      allowNull: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      references: {
        model: 'upload',
        key: 'id',
      },
    },
  })

  await queryInterface.addConstraint('user', {
    type: 'unique',
    fields: ['email'],
    name: 'UNIQUE_USERS_EMAIL',
  })
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.dropTable('user')
}
