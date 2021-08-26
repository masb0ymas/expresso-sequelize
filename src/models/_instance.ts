/* eslint-disable import/no-dynamic-require */
import path from 'path'
import Sequelize from 'sequelize'

const config = require(path.join(`${__dirname}/../config/database`))

const sequelize = new Sequelize.Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logQueryParameters: true,
  }
)

const db = {
  sequelize,
  Sequelize,
}

export default db
