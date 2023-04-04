import 'reflect-metadata'

import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { Sequelize, type SequelizeOptions } from 'sequelize-typescript'
import {
  SEQUELIZE_CONNECTION,
  SEQUELIZE_DATABASE,
  SEQUELIZE_HOST,
  SEQUELIZE_PASSWORD,
  SEQUELIZE_PORT,
  SEQUELIZE_TIMEZONE,
  SEQUELIZE_USERNAME,
} from '@config/env'

const pathEnv = path.resolve('.env')

if (!fs.existsSync(pathEnv)) {
  const envExample = chalk.cyan('.env.example')
  const envLocal = chalk.cyan('.env')

  const message = `Missing env!!!\nCopy / Duplicate ${envExample} root directory to ${envLocal}`
  throw new Error(message)
}

const sequelizeOptions: SequelizeOptions = {
  // @ts-expect-error
  dialect: SEQUELIZE_CONNECTION,
  host: SEQUELIZE_HOST,
  port: SEQUELIZE_PORT,
  logQueryParameters: true,
  timezone: SEQUELIZE_TIMEZONE,
  models: [`${__dirname}/entities`],
  // repositoryMode: true,
}

const sequelize = new Sequelize(
  SEQUELIZE_DATABASE,
  SEQUELIZE_USERNAME,
  SEQUELIZE_PASSWORD,
  { ...sequelizeOptions }
)

const db = { sequelize }

export default db
