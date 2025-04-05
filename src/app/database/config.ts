import { env } from '~/config/env'

export default {
  username: env.SEQUELIZE_USERNAME,
  password: env.SEQUELIZE_PASSWORD,
  database: env.SEQUELIZE_DATABASE,
  host: env.SEQUELIZE_HOST,
  port: env.SEQUELIZE_PORT,
  dialect: env.SEQUELIZE_CONNECTION,
  timezone: env.SEQUELIZE_TIMEZONE,
}
