'use strict'

const _ = require('lodash')
const ConstRole = require('../../@expresso/constants/ConstRole')

const data = [
  {
    id: ConstRole.ID_SUPER_ADMIN,
    name: 'Super Admin',
  },
  {
    id: ConstRole.ID_ADMIN,
    name: 'Admin',
  },
  {
    id: ConstRole.ID_USER,
    name: 'User',
  },
]

const formData = []

if (!_.isEmpty(data)) {
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i]

    formData.push({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', formData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {})
  },
}
