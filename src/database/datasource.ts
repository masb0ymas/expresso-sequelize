import 'reflect-metadata'

import { Sequelize, type SequelizeOptions } from 'sequelize-typescript'
import { env } from '~/config/env'

const sequelizeOptions: SequelizeOptions = {
  dialect: env.SEQUELIZE_CONNECTION,
  host: env.SEQUELIZE_HOST,
  port: env.SEQUELIZE_PORT,
  logQueryParameters: env.SEQUELIZE_LOGGING,
  timezone: env.SEQUELIZE_TIMEZONE,
  models: [`${__dirname}/entities`],
  // repositoryMode: true,
}

const sequelize = new Sequelize(
  env.SEQUELIZE_DATABASE,
  env.SEQUELIZE_USERNAME,
  env.SEQUELIZE_PASSWORD,
  { ...sequelizeOptions }
)

const db = { sequelize }

export default db
