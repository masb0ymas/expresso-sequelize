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
        allowNull: true,
        type: Sequelize.DATE,
      },
      keyFile: {
        type: Sequelize.STRING,
      },
      filename: {
        type: Sequelize.STRING,
      },
      mimetype: {
        type: Sequelize.STRING,
      },
      size: {
        type: Sequelize.INTEGER,
      },
      signedURL: {
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
