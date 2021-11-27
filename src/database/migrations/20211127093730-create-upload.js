'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Uploads', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      keyFile: {
        type: Sequelize.TEXT,
      },
      filename: {
        type: Sequelize.TEXT,
      },
      mimetype: {
        type: Sequelize.TEXT,
      },
      size: {
        type: Sequelize.INTEGER,
      },
      signedUrl: {
        type: Sequelize.TEXT,
      },
      expiryDateUrl: {
        type: Sequelize.DATE,
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
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Uploads')
  },
}
