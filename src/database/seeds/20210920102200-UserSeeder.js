'use strict'

const ConstRole = require('../../@expresso/constants/ConstRole')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

const salt = 10

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        firstName: 'Admin',
        lastName: 'System',
        email: 'admin@mail.com',
        password: bcrypt.hashSync('Padang123', salt),
        isActive: true,
        RoleId: ConstRole.ID_ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@mail.com',
        password: bcrypt.hashSync('Padang123', salt),
        isActive: true,
        RoleId: ConstRole.ID_USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
