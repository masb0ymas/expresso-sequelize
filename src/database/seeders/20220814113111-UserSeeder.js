'use strict'

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { default: ConstRole } = require('../../core/constants/ConstRole')
const { printLog } = require('expresso-core')

const salt = 10
const defaultPassword = 'Padang123'

const logMessage = printLog('Seed', `your default password: ${defaultPassword}`)
console.log(logMessage)

const data = [
  {
    fullname: 'Super Admin',
    email: 'super.admin@mail.com',
    RoleId: ConstRole.ID_SUPER_ADMIN,
  },
  {
    fullname: 'Admin',
    email: 'admin@mail.com',
    RoleId: ConstRole.ID_ADMIN,
  },
  {
    fullname: 'Test User',
    email: 'test.user@mail.com',
    RoleId: ConstRole.ID_USER,
  },
]

const formData = []

if (!_.isEmpty(data)) {
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i]

    formData.push({
      ...item,
      id: uuidv4(),
      isActive: true,
      password: bcrypt.hashSync(String(defaultPassword), salt),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('user', formData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', null, {})
  },
}
