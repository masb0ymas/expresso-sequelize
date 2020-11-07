import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import fs from 'fs'
import _path from 'path'

const { APP_NAME, PORT, NODE_ENV } = process.env

const baseRoutes = _path.resolve('./docs/swagger/routes')
// const baseSchemas = _path.resolve('./docs/swagger/schemas')

const getPathRoutes = (path) => `${baseRoutes}${path}`
// const getPathSchemes = (path) => `${baseSchemas}${path}`

const getDocs = (basePath, getPath) => {
  return fs.readdirSync(basePath).reduce((acc, file) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const data = require(getPath(`/${file}`))
    // eslint-disable-next-line no-param-reassign
    acc = {
      ...acc,
      ...data,
    }
    return acc
  }, {})
}

const docsSources = getDocs(baseRoutes, getPathRoutes)
// const docsSchemes = getDocs(baseSchemas, getPathSchemes)

const serverProduction = [
  {
    url: 'https://api.example.com/v1',
    description: 'Production server',
  },
]

const serverLocal = [
  {
    url: `http://localhost:${PORT || 8000}/v1`,
    description: 'Development server',
  },
  {
    url: 'https://api-staging.example.com/v1',
    description: 'Staging server',
  },
  {
    url: 'https://api.example.com/v1',
    description: 'Production server',
  },
]

module.exports = function generateDocs(app) {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.1',
      servers: NODE_ENV === 'production' ? serverProduction : serverLocal,
      // security: [  //Set GLOBAL
      //   {
      //     auth_token: []
      //   }
      // ],
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
        // schemas: docsSchemes,
        parameters: {
          page: {
            in: 'query',
            name: 'page',
            required: false,
            default: 0,
          },
          pageSize: {
            in: 'query',
            name: 'pageSize',
            required: false,
            default: 10,
          },
          filtered: {
            in: 'query',
            name: 'filtered',
            required: false,
            default: [],
            description: 'Example: [{"id": "nama", "value": "test"}]',
          },
          sorted: {
            in: 'query',
            name: 'sorted',
            required: false,
            default: [],
            description: 'Example: [{"id": "createdAt", "desc": true}]',
          },
        },
      },
      info: {
        title: `${APP_NAME} Documentation`,
        version: '1.0.0',
      },
      paths: docsSources,
    },
    apis: [],
  }

  const swaggerOptProduction = [
    {
      url: 'http://api.example.com/v1/api-docs.json',
      name: 'Production Server',
    },
  ]

  const swaggerOptLocal = [
    {
      url: `http://localhost:${PORT || 8000}/v1/api-docs.json`,
      name: 'Development Server',
    },
    {
      url: 'http://api-staging.example.com/v1/api-docs.json',
      name: 'Staging Server',
    },
    {
      url: 'http://api.example.com/v1/api-docs.json',
      name: 'Production Server',
    },
  ]

  const swaggerSpec = swaggerJSDoc(swaggerOptions)
  const optionsSwaggerUI = {
    explorer: true,
    swaggerOptions: {
      urls: NODE_ENV === 'production' ? swaggerOptProduction : swaggerOptLocal,
    },
  }

  app.get('/v1/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  app.use('/v1/api-docs', swaggerUI.serve)
  app.get('/v1/api-docs', swaggerUI.setup(swaggerSpec, optionsSwaggerUI))
}
