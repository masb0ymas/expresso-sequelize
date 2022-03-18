import chalk from 'chalk'
import {
  APP_PORT,
  NODE_ENV,
  URL_CLIENT_PRODUCTION,
  URL_CLIENT_SANDBOX,
  URL_SERVER_PRODUCTION,
  URL_SERVER_SANDBOX,
} from './env'

const URL_CLIENT = {
  development: 'http://localhost:3000',
  staging: URL_CLIENT_SANDBOX,
  production: URL_CLIENT_PRODUCTION,
}

const URL_SERVER = {
  development: `http://localhost:${APP_PORT ?? 8000}`,
  staging: URL_SERVER_SANDBOX,
  production: URL_SERVER_PRODUCTION,
}

export const LOG_SERVER = chalk.green('[server]')

// @ts-expect-error
const BASE_URL_CLIENT: string = URL_CLIENT[NODE_ENV]

// @ts-expect-error
const BASE_URL_SERVER: string = URL_SERVER[NODE_ENV]

export { BASE_URL_CLIENT, BASE_URL_SERVER }
