import {
  APP_PORT,
  NODE_ENV,
  URL_CLIENT_PRODUCTION,
  URL_CLIENT_STAGING,
  URL_SERVER_PRODUCTION,
  URL_SERVER_STAGING,
} from '~/config/env'

const URL_CLIENT: object | any = {
  development: 'http://localhost:3000',
  staging: URL_CLIENT_STAGING,
  production: URL_CLIENT_PRODUCTION,
}

const URL_SERVER: object | any = {
  development: `http://localhost:${APP_PORT}`,
  staging: URL_SERVER_STAGING,
  production: URL_SERVER_PRODUCTION,
}

export const BASE_URL_CLIENT: string = URL_CLIENT[NODE_ENV]
export const BASE_URL_SERVER: string = URL_SERVER[NODE_ENV]
