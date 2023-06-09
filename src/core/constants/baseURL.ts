import { env } from '~/config/env'

const URL_CLIENT: object | any = {
  development: 'http://localhost:3000',
  staging: env.URL_CLIENT_STAGING,
  production: env.URL_CLIENT_PRODUCTION,
}

const URL_SERVER: object | any = {
  development: `http://localhost:${env.APP_PORT}`,
  staging: env.URL_SERVER_STAGING,
  production: env.URL_SERVER_PRODUCTION,
}

export const BASE_URL_CLIENT: string = URL_CLIENT[env.NODE_ENV]
export const BASE_URL_SERVER: string = URL_SERVER[env.NODE_ENV]
