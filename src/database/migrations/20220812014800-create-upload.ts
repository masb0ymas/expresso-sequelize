'use strict'

import { DataTypes, QueryInterface } from 'sequelize'

export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.createTable('upload', {
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
    key_file: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    filename: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    mimetype: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    size: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    signed_url: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    expiry_date_url: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  })
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.dropTable('upload')
}
