'use strict'

import { green } from 'colorette'
import _ from 'lodash'
import { DataTypes, QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import { env } from '~/config/env'
import Hashing from '~/config/hashing'
import { logger } from '~/config/logger'
import { ConstRole } from '~/lib/constant/seed/role'

const hashing = new Hashing()

const defaultPassword = env.APP_DEFAULT_PASS
logger.info(`Seed - your default password: ${green(defaultPassword)}`)

const data = [
  {
    fullname: 'Super Admin',
    email: 'super.admin@example.com',
    role_id: ConstRole.ID_SUPER_ADMIN,
  },
  {
    fullname: 'Admin',
    email: 'admin@example.com',
    role_id: ConstRole.ID_ADMIN,
  },
  {
    fullname: 'User',
    email: 'user@example.com',
    role_id: ConstRole.ID_USER,
  },
]

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
  const password = await hashing.hash(defaultPassword)

  const formData: any[] = []

  if (!_.isEmpty(data)) {
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i]

      formData.push({
        ...item,
        id: uuidv4(),
        is_active: true,
        password,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }
  }

  await queryInterface.bulkInsert('user', formData)
}

export async function down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
  await queryInterface.bulkDelete('user', {})
}
