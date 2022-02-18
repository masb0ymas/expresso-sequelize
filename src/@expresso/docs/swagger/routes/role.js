module.exports = {
  '/role': {
    get: {
      tags: ['Role'],
      summary: 'Get All Role',
      produces: ['application/json'],
      security: [
        {
          auth_token: [],
        },
      ],
      parameters: [
        {
          $ref: '#/components/parameters/page',
        },
        {
          $ref: '#/components/parameters/pageSize',
        },
        {
          $ref: '#/components/parameters/filtered',
        },
        {
          $ref: '#/components/parameters/sorted',
        },
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      responses: {
        200: {
          description: 'Get All Role',
        },
      },
    },
    post: {
      tags: ['Role'],
      summary: 'Create New Role',
      security: [
        {
          auth_token: [],
        },
      ],
      parameters: [
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
              },
              required: ['name'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Create New Role',
        },
      },
    },
  },
  '/role/multiple/restore': {
    post: {
      tags: ['Role'],
      summary: 'Multiple Restore Role',
      security: [
        {
          auth_token: [],
        },
      ],
      parameters: [
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                ids: {
                  type: 'string',
                  description: '["id_1", "id_2"]',
                },
              },
              required: ['ids'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Multiple Restore Role',
        },
      },
    },
  },
  '/role/multiple/soft-delete': {
    post: {
      tags: ['Role'],
      summary: 'Multiple Soft Delete Role',
      security: [
        {
          auth_token: [],
        },
      ],
      parameters: [
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                ids: {
                  type: 'string',
                  description: '["id_1", "id_2"]',
                },
              },
              required: ['ids'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Multiple Soft Delete Role',
        },
      },
    },
  },
  '/role/multiple/force-delete': {
    post: {
      tags: ['Role'],
      summary: 'Multiple Force Delete Role ( Forever )',
      security: [
        {
          auth_token: [],
        },
      ],
      parameters: [
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                ids: {
                  type: 'string',
                  description: '["id_1", "id_2"]',
                },
              },
              required: ['ids'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Multiple Force Delete Role ( Forever )',
        },
      },
    },
  },
  '/role/{id}': {
    get: {
      tags: ['Role'],
      summary: 'Get Role By Id',
      produces: ['application/json'],
      security: [
        {
          auth_token: [],
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
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      responses: {
        200: {
          description: 'Get Role By Id',
        },
      },
    },
    put: {
      tags: ['Role'],
      summary: 'Update Data Role',
      security: [
        {
          auth_token: [],
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
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
              },
              required: ['name'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Update Data Role',
        },
      },
    },
  },
  '/role/restore/{id}': {
    put: {
      tags: ['Role'],
      summary: 'Restore Role By Id',
      security: [
        {
          auth_token: [],
        },
      ],
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
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      responses: {
        200: {
          description: 'Restore Role By Id',
        },
      },
    },
  },
  '/role/soft-delete/{id}': {
    delete: {
      tags: ['Role'],
      summary: 'Soft Delete Role By Id',
      security: [
        {
          auth_token: [],
        },
      ],
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
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      responses: {
        200: {
          description: 'Soft Delete Role By Id',
        },
      },
    },
  },
  '/role/force-delete/{id}': {
    delete: {
      tags: ['Role'],
      summary: 'Force Delete Role By Id ( Forever )',
      security: [
        {
          auth_token: [],
        },
      ],
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
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      responses: {
        200: {
          description: 'Force Delete Role By Id ( Forever )',
        },
      },
    },
  },
}
