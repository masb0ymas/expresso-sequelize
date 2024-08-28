import 'dotenv/config'

import { green } from 'colorette'
import { logger, validate } from 'expresso-core'
import fs from 'fs'
import path from 'path'

const ENV_FILE = '.env'
const ENV_EXAMPLE_FILE = '.env.example'

export function checkEnv(): void {
  const envPath = path.resolve(ENV_FILE)

  if (!fs.existsSync(envPath)) {
    const envExample = green(ENV_EXAMPLE_FILE)
    const env = green(ENV_FILE)

    logger.error(
      `Missing ${env} file! Please copy ${envExample} to ${env} in the root directory.`
    )
    process.exit(1)
  }
}

checkEnv()

/**
 *
 * @param key
 * @param fallback
 * @returns
 */
function _getEnv(key: string, fallback?: any): any {
  const value = process.env[key]

  if (value === undefined || value === null || value === '') {
    return fallback
  }

  return value
}

/**
 * App Env
 */
const appEnv = {
  // Application
  NODE_ENV: _getEnv('NODE_ENV', 'development'),

  APP_KEY: _getEnv('APP_KEY'),
  APP_NAME: _getEnv('APP_NAME', 'expresso'),
  APP_LANG: _getEnv('APP_LANG', 'id'),
  APP_PORT: validate.number(_getEnv('APP_PORT', 8000)),
  APP_PASSWORD: _getEnv('APP_PASSWORD', 'expresso'),

  // Config
  AXIOS_TIMEOUT: _getEnv('AXIOS_TIMEOUT', '5m'),
  RATE_LIMIT: validate.number(_getEnv('RATE_LIMIT', 100)),
  RATE_DELAY: _getEnv('RATE_DELAY', '5m'),
}

/**
 * Secret Env
 */
const secretEnv = {
  // OTP
  SECRET_OTP: _getEnv('SECRET_OTP'),
  EXPIRED_OTP: _getEnv('EXPIRED_OTP', '5m'),

  // JWT
  JWT_SECRET_ACCESS_TOKEN: _getEnv('JWT_SECRET_ACCESS_TOKEN'),
  JWT_ACCESS_TOKEN_EXPIRED: _getEnv('JWT_ACCESS_TOKEN_EXPIRED', '1d'),

  JWT_SECRET_REFRESH_TOKEN: _getEnv('JWT_SECRET_REFRESH_TOKEN'),
  JWT_REFRESH_TOKEN_EXPIRED: _getEnv('JWT_REFRESH_TOKEN_EXPIRED', '30d'),
}

/**
 * Base URL Env
 */
const baseURLEnv = {
  // Base URL
  URL_CLIENT_STAGING: _getEnv(
    'URL_CLIENT_STAGING',
    'https://sandbox.example.com'
  ),
  URL_SERVER_STAGING: _getEnv(
    'URL_SERVER_STAGING',
    'https://api-sandbox.example.com'
  ),

  URL_CLIENT_PRODUCTION: _getEnv(
    'URL_CLIENT_PRODUCTION',
    'https://example.com'
  ),
  URL_SERVER_PRODUCTION: _getEnv(
    'URL_SERVER_PRODUCTION',
    'https://api.example.com'
  ),
}

/**
 * Database Env
 */
const databaseEnv = {
  SEQUELIZE_CONNECTION: _getEnv('SEQUELIZE_CONNECTION', 'postgres'),
  SEQUELIZE_HOST: _getEnv('SEQUELIZE_HOST', '127.0.0.1'),
  SEQUELIZE_PORT: validate.number(_getEnv('SEQUELIZE_PORT', 5432)),
  SEQUELIZE_DATABASE: _getEnv('SEQUELIZE_DATABASE', 'expresso'),
  SEQUELIZE_USERNAME: _getEnv('SEQUELIZE_USERNAME', 'postgres'),
  SEQUELIZE_PASSWORD: _getEnv('SEQUELIZE_PASSWORD', 'postgres'),
  SEQUELIZE_SYNC: validate.boolean(_getEnv('SEQUELIZE_SYNC', true)),
  SEQUELIZE_LOGGING: validate.boolean(_getEnv('SEQUELIZE_LOGGING', true)),
  SEQUELIZE_TIMEZONE: _getEnv('SEQUELIZE_TIMEZONE', 'Asia/Jakarta'),
}

/**
 * SMTP Env
 */
const mailEnv = {
  // default smtp
  MAIL_DRIVER: _getEnv('MAIL_DRIVER', 'smtp'),
  MAIL_HOST: _getEnv('MAIL_HOST', 'smtp.mailtrap.io'),
  MAIL_PORT: validate.number(_getEnv('MAIL_PORT', 2525)),
  MAIL_AUTH_TYPE: _getEnv('MAIL_AUTH_TYPE'),
  MAIL_USERNAME: _getEnv('MAIL_USERNAME'),
  MAIL_PASSWORD: _getEnv('MAIL_PASSWORD'),
  MAIL_ENCRYPTION: _getEnv('MAIL_ENCRYPTION'),

  // mailgun smtp
  MAILGUN_API_KEY: _getEnv('MAILGUN_API_KEY'),
  MAILGUN_DOMAIN: _getEnv('MAILGUN_DOMAIN'),

  // google OAuth smtp
  OAUTH_CLIENT_ID: _getEnv('OAUTH_CLIENT_ID'),
  OAUTH_CLIENT_SECRET: _getEnv('OAUTH_CLIENT_SECRET'),
  OAUTH_REDIRECT_URL: _getEnv('OAUTH_REDIRECT_URL'),
  OAUTH_REFRESH_TOKEN: _getEnv('OAUTH_REFRESH_TOKEN'),
}

/**
 * Redis Env
 */
const redisEnv = {
  REDIS_HOST: _getEnv('REDIS_HOST', '127.0.0.1'),
  REDIS_PORT: validate.number(_getEnv('REDIS_PORT', 6379)),
  REDIS_PASSWORD: _getEnv('REDIS_PASSWORD'),
}

/**
 * Storage Env
 */
const storageEnv = {
  STORAGE_PROVIDER: _getEnv('STORAGE_PROVIDER', 'minio'),
  STORAGE_HOST: _getEnv('STORAGE_HOST', '127.0.0.1'),
  STORAGE_PORT: _getEnv('STORAGE_PORT', 9000),
  STORAGE_ACCESS_KEY: _getEnv('STORAGE_ACCESS_KEY'),
  STORAGE_SECRET_KEY: _getEnv('STORAGE_SECRET_KEY'),
  STORAGE_BUCKET_NAME: _getEnv('STORAGE_BUCKET_NAME', 'expresso'),
  STORAGE_REGION: _getEnv('STORAGE_REGION', 'ap-southeast-1'),
  STORAGE_SIGN_EXPIRED: _getEnv('STORAGE_SIGN_EXPIRED', '7d'),
}

/**
 * Third Party Env
 */
const thirdPartyEnv = {
  // open street map
  OPEN_STREET_MAP_URL: _getEnv(
    'OPEN_STREET_MAP_URL',
    'https://nominatim.openstreetmap.org'
  ),
}

export const env = {
  ...appEnv,
  ...secretEnv,
  ...baseURLEnv,
  ...databaseEnv,
  ...mailEnv,
  ...redisEnv,
  ...storageEnv,
  ...thirdPartyEnv,
}
