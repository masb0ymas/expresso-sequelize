import {
  DB_CONNECTION,
  DB_DATABASE,
  DB_HOST,
  DB_OPERATOR_ALIAS,
  DB_PASSWORD,
  DB_PORT,
  DB_TIMEZONE,
  DB_USERNAME,
} from './env'

module.exports = {
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_CONNECTION,
  operatorsAliases: DB_OPERATOR_ALIAS,
  timezone: DB_TIMEZONE,
}
