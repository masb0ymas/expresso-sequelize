'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      UserId: {
        type: Sequelize.UUID,
      },
      token: {
        type: Sequelize.TEXT,
      },
      ipAddress: {
        type: Sequelize.STRING,
      },
      device: {
        type: Sequelize.STRING, // Desktop, Mobile, Tablet
      },
      platform: {
        type: Sequelize.STRING, // Android, iOS, Web Browser
      },
      latitude: {
        type: Sequelize.STRING,
      },
      longitude: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sessions')
  },
}
