/* eslint-disable prettier/prettier */
import dotenv from 'dotenv'

dotenv.config()

// node env
export const NODE_ENV = process.env.NODE_ENV ?? 'development'

// app
export const APP_KEY = process.env.APP_KEY
export const APP_LANG = process.env.APP_LANG ?? 'id'
export const APP_NAME = process.env.APP_NAME ?? 'expresso'
export const APP_PORT = Number(process.env.APP_PORT) ?? 8000

// axios
export const AXIOS_TIMEOUT = Number(process.env.AXIOS_TIMEOUT) ?? 5000

// rate limit request
export const RATE_LIMIT = Number(process.env.RATE_LIMIT) ?? 100

// otp
export const SECRET_OTP: any = process.env.SECRET_OTP
export const EXPIRED_OTP = process.env.EXPIRED_OTP ?? '5m'

// jwt access
export const JWT_SECRET_ACCESS_TOKEN: any = process.env.JWT_SECRET_ACCESS_TOKEN
export const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED ?? '1d'

// jwt refresh
export const JWT_SECRET_REFRESH_TOKEN: any = process.env.JWT_SECRET_REFRESH_TOKEN
export const JWT_REFRESH_TOKEN_EXPIRED = process.env.JWT_REFRESH_TOKEN_EXPIRED ?? '7d'

// url sandbox
export const URL_CLIENT_SANDBOX = process.env.URL_CLIENT_SANDBOX ?? 'https://sandbox.example.com'
export const URL_SERVER_SANDBOX = process.env.URL_SERVER_SANDBOX ?? 'https://api-sandbox.example.com'

// url production
export const URL_CLIENT_PRODUCTION = process.env.URL_CLIENT_PRODUCTION ?? 'https://example.com'
export const URL_SERVER_PRODUCTION = process.env.URL_SERVER_PRODUCTION ?? 'https://api.example.com'

// database
export const DB_CONNECTION = process.env.DB_CONNECTION ?? 'mysql'
export const DB_HOST = process.env.DB_HOST ?? '127.0.0.1'
export const DB_PORT = Number(process.env.DB_PORT) ?? 3306
export const DB_DATABASE = process.env.DB_DATABASE ?? 'example'
export const DB_USERNAME = process.env.DB_USERNAME ?? 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD ?? undefined
export const DB_OPERATOR_ALIAS = process.env.DB_OPERATOR_ALIAS ?? undefined
export const DB_TIMEZONE = process.env.DB_TIMEZONE ?? '+07:00' // for mysql = +07:00, for postgres = Asia/Jakarta

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

// firebase
export const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY ?? undefined
export const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN ?? undefined
export const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL ?? undefined
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? undefined
export const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET ?? undefined
export const FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID ?? undefined
export const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID ?? undefined
export const FIREBASE_MEASUREMENT_ID = process.env.FIREBASE_MEASUREMENT_ID ?? undefined

// aws s3
export const AWS_ACCESS_KEY: any = process.env.AWS_ACCESS_KEY ?? undefined
export const AWS_SECRET_KEY: any = process.env.AWS_SECRET_KEY ?? undefined
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME ?? 'expresso'
export const AWS_REGION = process.env.AWS_REGION ?? 'ap-southeast-1'
export const AWS_S3_EXPIRED = process.env.AWS_S3_EXPIRED ?? '7d'
