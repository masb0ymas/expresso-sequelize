'use strict'

const ConstRole = require('../../@expresso/constants/ConstRole')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
      {
        id: ConstRole.ID_SUPER_ADMIN,
        name: 'Super Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: ConstRole.ID_ADMIN,
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: ConstRole.ID_USER,
        name: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {})
  },
}
