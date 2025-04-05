import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import { env } from '~/config/env'
import { __dirname, require } from '../string'

const _pathRouteDocs = path.resolve(`${__dirname}/public/swagger/routes`)
const _pathSchemaDocs = path.resolve(`${__dirname}/public/swagger/schema`)

function _getDocsSwaggers(_path: string | Buffer): Record<string, unknown> {
  return fs.readdirSync(_path).reduce((acc, file) => {
    const data = require(`${_path}/${file}`)
    acc = { ...acc, ...data }

    return acc
  }, {})
}

const routesDocs = _getDocsSwaggers(_pathRouteDocs)
const schemaDocs = _getDocsSwaggers(_pathSchemaDocs)

const baseURLServer = [
  {
    url: env.APP_URL,
    description: `${_.capitalize(env.NODE_ENV)} Server`,
  },
]

const swaggerOptURL = [
  {
    url: `${env.APP_URL}/v1/swagger.json`,
    name: `${_.capitalize(env.NODE_ENV)} Server`,
  },
]

export const swaggerOptions = {
  definition: {
    info: {
      title: `Api ${env.APP_NAME} Docs`,
      description: `This is Api Documentation ${env.APP_NAME}`,
      license: {
        name: 'MIT',
      },
      version: '1.0.0',
    },
    openapi: '3.0.1',
    servers: baseURLServer,
    components: {
      securitySchemes: {
        auth_token: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description:
            'JWT Authorization header using the JWT scheme. Example: “Authorization: JWT {token}”',
        },
      },
      schemas: schemaDocs,
      parameters: {
        page: {
          in: 'query',
          name: 'page',
          schema: { type: 'string' },
          required: false,
        },
        pageSize: {
          in: 'query',
          name: 'pageSize',
          schema: { type: 'string' },
          required: false,
        },
        filtered: {
          in: 'query',
          name: 'filtered',
          schema: { type: 'string' },
          required: false,
          description: 'example: [{"id": "email", "value": "anyValue"}]',
        },
        sorted: {
          in: 'query',
          name: 'sorted',
          schema: { type: 'string' },
          required: false,
          description: 'example: [{"sort": "created_at", "order": "DESC"}]',
        },
        lang: {
          in: 'query',
          name: 'lang',
          schema: { type: 'string', enum: ['en', 'id'] },
          required: false,
        },
      },
    },
    paths: routesDocs,
  },
  apis: [],
}

export const swaggerSpec = swaggerJSDoc(swaggerOptions)
export const optionsSwaggerUI = {
  explorer: true,
  swaggerOptions: { urls: swaggerOptURL },
}
