'use strict'

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const chalk = require('chalk')
const randomstring = require('randomstring')
const ConstRole = require('../../@expresso/constants/ConstRole')

const salt = 10
const defaultPassword = randomstring.generate(10)

console.log(
  `${chalk.green('[server]')} ${chalk.blue('Seed')} ${chalk.green(
    'your default password: '
  )}`,
  { defaultPassword }
)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        firstName: 'Super',
        lastName: 'Admin',
        email: 'super.admin@mail.com',
        password: bcrypt.hashSync(String(defaultPassword), salt),
        isActive: true,
        RoleId: ConstRole.ID_SUPER_ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        firstName: 'Admin',
        lastName: 'System',
        email: 'admin@mail.com',
        password: bcrypt.hashSync(String(defaultPassword), salt),
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
        password: bcrypt.hashSync(defaultPassword, salt),
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
