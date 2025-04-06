import 'dotenv/config'
import { validate } from '~/lib/validate'

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_PORT: validate.number(process.env.APP_PORT) || 8000,
  APP_NAME: process.env.APP_NAME || 'Backend',
  APP_URL: process.env.APP_URL || 'http://localhost:8000',
  APP_DEFAULT_PASS: process.env.APP_DEFAULT_PASS || 'yourpassword',

  SEQUELIZE_CONNECTION: process.env.SEQUELIZE_CONNECTION || 'postgres',
  SEQUELIZE_HOST: process.env.SEQUELIZE_HOST || '127.0.0.1',
  SEQUELIZE_PORT: validate.number(process.env.SEQUELIZE_PORT) || 5432,
  SEQUELIZE_DATABASE: process.env.SEQUELIZE_DATABASE || 'postgres',
  SEQUELIZE_USERNAME: process.env.SEQUELIZE_USERNAME || 'postgres',
  SEQUELIZE_PASSWORD: process.env.SEQUELIZE_PASSWORD || 'postgres',
  SEQUELIZE_SYNC: validate.boolean(process.env.SEQUELIZE_SYNC) || false,
  SEQUELIZE_LOGGING: validate.boolean(process.env.SEQUELIZE_LOGGING) || true,
  SEQUELIZE_TIMEZONE: process.env.SEQUELIZE_TIMEZONE || 'Asia/Jakarta',

  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || 'gcs',
  STORAGE_HOST: process.env.STORAGE_HOST || '',
  STORAGE_PORT: validate.number(process.env.STORAGE_PORT),
  STORAGE_ACCESS_KEY: process.env.STORAGE_ACCESS_KEY || '',
  STORAGE_SECRET_KEY: process.env.STORAGE_SECRET_KEY || '',
  STORAGE_BUCKET_NAME: process.env.STORAGE_BUCKET_NAME || '',
  STORAGE_REGION: process.env.STORAGE_REGION || '',
  STORAGE_SIGN_EXPIRED: process.env.STORAGE_SIGN_EXPIRED || '7d',
  STORAGE_FILEPATH: process.env.STORAGE_FILEPATH || '',

  JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d',

  MAIL_DRIVER: process.env.MAIL_DRIVER || 'smtp',
  MAIL_HOST: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  MAIL_PORT: validate.number(process.env.MAIL_PORT) || 587,
  MAIL_FROM: process.env.MAIL_FROM || ' ',
  MAIL_USERNAME: process.env.MAIL_USERNAME || ' ',
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || ' ',
  MAIL_ENCRYPTION: process.env.MAIL_ENCRYPTION || ' ',
}
