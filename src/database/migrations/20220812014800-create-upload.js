'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('upload', {
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
        type: Sequelize.DATE,
      },
      keyFile: {
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
      signedURL: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      expiryDateURL: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('upload')
  },
}
