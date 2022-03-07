/* eslint-disable @typescript-eslint/no-var-requires */
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

const pathEnv = path.resolve('.env')

if (!fs.existsSync(pathEnv)) {
  const envExample = chalk.cyan('.env.example')
  const envLocal = chalk.cyan('.env')
  throw new Error(
    `Missing env!!!\nCopy / Duplicate ${envExample} root directory to ${envLocal}`
  )
}

const optConfig = require(path.resolve(`${__dirname}/../../config/database`))

const sequelize = new Sequelize.Sequelize(
  optConfig.database,
  optConfig.username,
  optConfig.password,
  {
    ...optConfig,
    logQueryParameters: true,
  }
)

const db = {
  sequelize,
  Sequelize,
}

export default db
