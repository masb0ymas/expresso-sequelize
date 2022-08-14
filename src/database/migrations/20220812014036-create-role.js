'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role', {
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
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      name: {
        type: Sequelize.STRING,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('role')
  },
}
