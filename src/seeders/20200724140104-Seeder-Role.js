const ConstRoles = require('@expresso/constants/ConstRoles')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [
      {
        id: ConstRoles.ID_ADMIN,
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: ConstRoles.ID_UMUM,
        name: 'Umum',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {})
  },
}
