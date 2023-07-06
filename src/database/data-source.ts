import 'reflect-metadata'

import { blue } from 'colorette'
import fs from 'fs'
import path from 'path'
import { Sequelize, type SequelizeOptions } from 'sequelize-typescript'
import { env } from '~/config/env'
import { logger } from '~/config/pino'

const pathEnv = path.resolve('.env')

if (!fs.existsSync(pathEnv)) {
  const envExample = blue('.env.example')
  const envLocal = blue('.env')

  const message = `Missing env!!!\nCopy / Duplicate ${envExample} root directory to ${envLocal}`
  logger.info(`${message}`)

  throw new Error(message)
}

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
