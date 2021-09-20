const {
  NODE_ENV,
  PORT,
  URL_CLIENT_STAGING,
  URL_SERVER_STAGING,
  URL_CLIENT_PRODUCTION,
  URL_SERVER_PRODUCTION,
} = process.env

const URL_CLIENT = {
  development: 'http://localhost:3000',
  staging: URL_CLIENT_STAGING ?? 'https://staging.example.com',
  production: URL_CLIENT_PRODUCTION ?? 'https://example.com',
}

const URL_SERVER = {
  development: `http://localhost:${PORT ?? 8000}`,
  staging: URL_SERVER_STAGING ?? 'https://api-staging.example.com',
  production: URL_SERVER_PRODUCTION ?? 'https://api.example.com',
}

const ENV = NODE_ENV ?? 'development'

// @ts-expect-error
const BASE_URL_CLIENT: string = URL_CLIENT[ENV]
// @ts-expect-error
const BASE_URL_SERVER: string = URL_SERVER[ENV]

export { BASE_URL_CLIENT, BASE_URL_SERVER }
