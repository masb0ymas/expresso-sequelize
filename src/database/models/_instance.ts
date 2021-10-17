/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import Sequelize from 'sequelize'

const optConfig = require(path.join(`${__dirname}/../../config/database`))

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
