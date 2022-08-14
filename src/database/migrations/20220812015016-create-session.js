'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      token: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      ipAddress: {
        type: Sequelize.STRING,
      },
      device: {
        type: Sequelize.STRING,
      },
      platform: {
        type: Sequelize.STRING,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('session')
  },
}
