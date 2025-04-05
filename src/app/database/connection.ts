import 'reflect-metadata'

import { Sequelize, type SequelizeOptions } from 'sequelize-typescript'
import { env } from '~/config/env'
import { logger } from '~/config/logger'
import { __dirname } from '~/lib/string'

type ConnectionType = 'postgres' | 'mysql'

const sequelizeOptions: SequelizeOptions = {
  dialect: env.SEQUELIZE_CONNECTION as ConnectionType,
  host: env.SEQUELIZE_HOST,
  port: env.SEQUELIZE_PORT,
  username: env.SEQUELIZE_USERNAME,
  password: env.SEQUELIZE_PASSWORD,
  database: env.SEQUELIZE_DATABASE,
  logQueryParameters: env.SEQUELIZE_LOGGING,
  timezone: env.SEQUELIZE_TIMEZONE,
  models: [`${__dirname}/dist/app/database/entity`],
}

const sequelize = new Sequelize({ ...sequelizeOptions })
export const db = { sequelize }

export const initDatabase = async () => {
  try {
    await sequelize.authenticate()
    logger.info(`Database connection established: ${sequelize.options.database}`)

    // not recommended when running in production mode
    if (env.SEQUELIZE_SYNC) {
      await sequelize.sync({ force: true })
      logger.info(`Sync database successfully`)
    }
  } catch (error: any) {
    logger.error(`Failed to initialize database: ${error.message}`)
    process.exit(1)
  }
}
