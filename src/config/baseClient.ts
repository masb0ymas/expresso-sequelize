const BASE_URL = {
  development: 'http://localhost:3000',
  staging: 'http://minangitcamp.com',
  production: 'http://minangitcamp.com',
}

const ENV = process.env.NODE_ENV || 'development'

// @ts-ignore
export const BASE_URL_CLIENT = BASE_URL[ENV]
