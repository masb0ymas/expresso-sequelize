import 'dotenv/config'
import { validateBoolean } from 'expresso-core'

// node env
export const NODE_ENV = process.env.NODE_ENV ?? 'development'

// app
export const APP_KEY = process.env.APP_KEY ?? undefined
export const APP_NAME = process.env.APP_NAME ?? 'expresso'
export const APP_LANG = process.env.APP_LANG ?? 'id'
export const APP_PORT = Number(process.env.APP_PORT) ?? 8000

export const AXIOS_TIMEOUT = process.env.AXIOS_TIMEOUT ?? '5m'
export const RATE_LIMIT = Number(process.env.RATE_LIMIT) ?? 100

// otp
export const SECRET_OTP = process.env.SECRET_OTP ?? undefined
export const EXPIRED_OTP = process.env.EXPIRED_OTP ?? '5m'

// jwt access
export const JWT_SECRET_ACCESS_TOKEN =
  process.env.JWT_SECRET_ACCESS_TOKEN ?? undefined
export const JWT_ACCESS_TOKEN_EXPIRED =
  process.env.JWT_ACCESS_TOKEN_EXPIRED ?? '1d'

// jwt refresh
export const JWT_SECRET_REFRESH_TOKEN =
  process.env.JWT_SECRET_REFRESH_TOKEN ?? undefined
export const JWT_REFRESH_TOKEN_EXPIRED =
  process.env.JWT_REFRESH_TOKEN_EXPIRED ?? '30d'

// url staging
export const URL_CLIENT_STAGING =
  process.env.URL_CLIENT_STAGING ?? 'https://sandbox.example.com'
export const URL_SERVER_STAGING =
  process.env.URL_SERVER_STAGING ?? 'https://api-sandbox.example.com'

// url production
export const URL_CLIENT_PRODUCTION =
  process.env.URL_CLIENT_PRODUCTION ?? 'https://example.com'
export const URL_SERVER_PRODUCTION =
  process.env.URL_SERVER_PRODUCTION ?? 'https://api.example.com'

// database
export const SEQUELIZE_CONNECTION =
  process.env.SEQUELIZE_CONNECTION ?? 'postgres'
export const SEQUELIZE_HOST = process.env.SEQUELIZE_HOST ?? '127.0.0.1'
export const SEQUELIZE_PORT = Number(process.env.SEQUELIZE_PORT) ?? 5432
export const SEQUELIZE_DATABASE = process.env.SEQUELIZE_DATABASE ?? 'expresso'
export const SEQUELIZE_USERNAME = process.env.SEQUELIZE_USERNAME ?? 'postgres'
export const SEQUELIZE_PASSWORD = process.env.SEQUELIZE_PASSWORD ?? 'postgres'
export const SEQUELIZE_SYNC =
  validateBoolean(process.env.SEQUELIZE_SYNC) ?? false
export const SEQUELIZE_TIMEZONE = process.env.SEQUELIZE_TIMEZONE ?? 'UTC'

// smtp
export const MAIL_DRIVER = process.env.MAIL_DRIVER ?? 'smtp'
export const MAIL_HOST = process.env.MAIL_HOST ?? 'smtp.mailtrap.io'
export const MAIL_PORT = Number(process.env.MAIL_PORT) ?? 2525
export const MAIL_AUTH_TYPE = process.env.MAIL_AUTH_TYPE ?? undefined
export const MAIL_USERNAME = process.env.MAIL_USERNAME ?? undefined
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD ?? undefined
export const MAIL_ENCRYPTION = process.env.MAIL_ENCRYPTION ?? undefined

// smtp mailgun
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY ?? undefined
export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN ?? undefined

// smtp google OAuth
export const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID ?? undefined
export const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET ?? undefined
export const OAUTH_REDIRECT_URL = process.env.OAUTH_REDIRECT_URL ?? undefined
export const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN ?? undefined

// redis
export const REDIS_HOST = process.env.REDIS_HOST ?? '127.0.0.1'
export const REDIS_PORT = Number(process.env.REDIS_PORT) ?? 6379
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? undefined

// storage
export const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER ?? 'minio'
export const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY ?? undefined
export const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY ?? undefined
export const STORAGE_BUCKET_NAME = process.env.STORAGE_BUCKET_NAME ?? 'expresso'
export const STORAGE_REGION = process.env.STORAGE_REGION ?? 'ap-southeast-1'
export const STORAGE_SIGN_EXPIRED = process.env.STORAGE_SIGN_EXPIRED ?? '7d'
