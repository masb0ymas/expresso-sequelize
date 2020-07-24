module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [
      {
        id: '366aadd0-eb0c-4203-9928-7ad87c80aafa',
        nama: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4f1efd44-9919-44a8-89ca-32324c810496',
        nama: 'Umum',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
