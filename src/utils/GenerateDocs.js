import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import fs from 'fs'
import _path from 'path'

const baseRoutes = _path.resolve('./docs/swagger/routes')
const baseSchemas = _path.resolve('./docs/swagger/schemas')

const getPathRoutes = (path) => `${baseRoutes}${path}`
const getPathSchemes = (path) => `${baseSchemas}${path}`

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
const docsSchemes = getDocs(baseSchemas, getPathSchemes)

module.exports = function generateDocs(app) {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.1',
      servers: [
        {
          url: 'http://localhost:8000/v1',
          description: 'Local server',
        },
        {
          url: 'https://api.example.com/v1',
          description: 'Testing server',
        },
        {
          url: 'https://api.example.com/v1',
          description: 'Production server',
        },
      ],
      // security: [  //Set GLOBAL
      //   {
      //     ApiKeyAuth: []
      //   }
      // ],
      components: {
        securitySchemes: {
          auth_token: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
          },
        },
        schemas: docsSchemes,
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
        title: 'BeyondRun New Documentation',
        version: '1.0.0',
      },
      paths: docsSources,
    },
    apis: [],
  }

  const swaggerSpec = swaggerJSDoc(swaggerOptions)

  app.get('/v1/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
}
