module.exports = {
  '/upload': {
    get: {
      tags: ['Upload'],
      summary: 'Get All Upload',
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
      ],
      responses: {
        200: {
          description: 'Get All Upload',
        },
      },
    },
    post: {
      tags: ['Upload'],
      summary: 'Create New Upload',
      security: [
        {
          auth_token: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                fileUpload: {
                  type: 'file',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
              required: ['fileUpload'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Create New Upload',
        },
      },
    },
  },
  '/upload/multiple/restore': {
    post: {
      tags: ['Upload'],
      summary: 'Multiple Restore Upload',
      security: [
        {
          auth_token: [],
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
          description: 'Multiple Restore Upload',
        },
      },
    },
  },
  '/upload/multiple/soft-delete': {
    post: {
      tags: ['Upload'],
      summary: 'Multiple Soft Delete Upload',
      security: [
        {
          auth_token: [],
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
          description: 'Multiple Soft Delete Upload',
        },
      },
    },
  },
  '/upload/multiple/force-delete': {
    post: {
      tags: ['Upload'],
      summary: 'Multiple Force Delete Upload ( Forever )',
      security: [
        {
          auth_token: [],
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
          description: 'Multiple Force Delete Upload ( Forever )',
        },
      },
    },
  },
  '/upload/{id}': {
    get: {
      tags: ['Upload'],
      summary: 'Get Upload By Id',
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
          description: 'Upload Id',
        },
      ],
      responses: {
        200: {
          description: 'Get Upload By Id',
        },
      },
    },
    put: {
      tags: ['Upload'],
      summary: 'Update Data Upload',
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
          description: 'Upload Id',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                fileUpload: {
                  type: 'file',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
              required: ['fileUpload'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Update Data Upload',
        },
      },
    },
  },
  '/upload/restore/{id}': {
    put: {
      tags: ['Upload'],
      summary: 'Restore Upload By Id',
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
          description: 'Upload Id',
        },
      ],
      responses: {
        200: {
          description: 'Restore Upload By Id',
        },
      },
    },
  },
  '/upload/soft-delete/{id}': {
    delete: {
      tags: ['Upload'],
      summary: 'Soft Delete Upload By Id',
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
          description: 'Upload Id',
        },
      ],
      responses: {
        200: {
          description: 'Soft Delete Upload By Id',
        },
      },
    },
  },
  '/upload/force-delete/{id}': {
    delete: {
      tags: ['Upload'],
      summary: 'Force Delete Upload By Id ( Forever )',
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
          description: 'Upload Id',
        },
      ],
      responses: {
        200: {
          description: 'Force Delete Upload By Id ( Forever )',
        },
      },
    },
  },
}