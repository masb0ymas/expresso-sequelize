module.exports = {
  '/role': {
    get: {
      tags: ['Role'],
      summary: 'Get Role',
      produces: ['application/json'],
      responses: {
        '200': {
          description: 'Get Role',
        },
      },
    },
    post: {
      tags: ['Role'],
      summary: 'Create new Data to Role',
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                nama: {
                  type: 'string',
                },
              },
              required: ['nama'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Create new Data to Role',
        },
      },
    },
  },
  '/role/{id}': {
    get: {
      tags: ['Role'],
      summary: 'Get Role By Id',
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Role Id',
        },
      ],
      responses: {
        '200': {
          description: 'Get Role By Id',
        },
      },
    },
    put: {
      tags: ['Role'],
      summary: 'Update data Role',
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Role Id',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                nama: {
                  type: 'string',
                },
              },
              required: ['nama'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Update data Role',
        },
      },
    },
    delete: {
      tags: ['Role'],
      summary: 'Delete Role By Id',
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Role Id',
        },
      ],
      responses: {
        '200': {
          description: 'Delete Role By Id',
        },
      },
    },
  },
}
