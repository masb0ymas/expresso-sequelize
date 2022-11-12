import 'reflect-metadata'

import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import {
  DB_CONNECTION,
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_TIMEZONE,
  DB_USERNAME,
} from '../config/env'

const pathEnv = path.resolve('.env')

if (!fs.existsSync(pathEnv)) {
  const envExample = chalk.cyan('.env.example')
  const envLocal = chalk.cyan('.env')
  throw new Error(
    `Missing env!!!\nCopy / Duplicate ${envExample} root directory to ${envLocal}`
  )
}

const sequelizeOptions: SequelizeOptions = {
  // @ts-expect-error
  dialect: DB_CONNECTION,
  host: DB_HOST,
  port: DB_PORT,
  logQueryParameters: true,
  timezone: DB_TIMEZONE,
  models: [`${__dirname}/entities`],
  // repositoryMode: true,
}

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  ...sequelizeOptions,
})

const db = { sequelize }

export default db
