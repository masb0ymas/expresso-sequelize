module.exports = {
  '/hobby': {
    get: {
      tags: ['Hobby'],
      summary: 'Get All Hobby',
      produces: ['application/json'],
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
          description: 'Get All Hobby',
        },
      },
    },
    post: {
      tags: ['Hobby'],
      summary: 'Create New Hobby',
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
          description: 'Create New Hobby',
        },
      },
    },
  },
  '/hobby/import-excel': {
    post: {
      tags: ['Hobby'],
      summary: 'Import Excel',
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
                fileExcel: {
                  type: 'file',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
              required: ['fileExcel'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Import Excel',
        },
      },
    },
  },
  '/hobby/export-excel': {
    get: {
      tags: ['Hobby'],
      summary: 'Get All Hobby with Export Excel',
      security: [
        {
          auth_token: [],
        },
      ],
      produces: ['application/json'],
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
          description: 'Get All Hobby with Export Excel',
        },
      },
    },
  },
  '/hobby/generate-excel': {
    get: {
      tags: ['Hobby'],
      summary: 'Get All Hobby with Generate Excel',
      security: [
        {
          auth_token: [],
        },
      ],
      produces: ['application/json'],
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
          description: 'Get All Hobby with Generate Excel',
        },
      },
    },
  },
  '/hobby/multiple/soft-delete': {
    post: {
      tags: ['Hobby'],
      summary: 'Multiple Soft Delete Hobby',
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
          description: 'Multiple Soft Delete Hobby',
        },
      },
    },
  },
  '/hobby/multiple/restore': {
    post: {
      tags: ['Hobby'],
      summary: 'Multiple Restore Hobby',
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
          description: 'Multiple Restore Hobby',
        },
      },
    },
  },
  '/hobby/multiple/force-delete': {
    post: {
      tags: ['Hobby'],
      summary: 'Multiple Force Delete Hobby ( Forever )',
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
          description: 'Multiple Force Delete Hobby ( Forever )',
        },
      },
    },
  },
  '/hobby/{id}': {
    get: {
      tags: ['Hobby'],
      summary: 'Get Hobby By Id',
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Hobby Id',
        },
      ],
      responses: {
        200: {
          description: 'Get Hobby By Id',
        },
      },
    },
    put: {
      tags: ['Hobby'],
      summary: 'Update Data Hobby',
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
          description: 'Hobby Id',
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
          description: 'Update Data Hobby',
        },
      },
    },
  },
  '/hobby/soft-delete/{id}': {
    delete: {
      tags: ['Hobby'],
      summary: 'Soft Delete Hobby By Id',
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
          description: 'Hobby Id',
        },
      ],
      responses: {
        200: {
          description: 'Soft Delete Hobby By Id',
        },
      },
    },
  },
  '/hobby/restore/{id}': {
    put: {
      tags: ['Hobby'],
      summary: 'Restore Hobby By Id',
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
          description: 'Hobby Id',
        },
      ],
      responses: {
        200: {
          description: 'Restore Hobby By Id',
        },
      },
    },
  },
  '/hobby/force-delete/{id}': {
    delete: {
      tags: ['Hobby'],
      summary: 'Force Delete Hobby By Id ( Forever )',
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
          description: 'Hobby Id',
        },
      ],
      responses: {
        200: {
          description: 'Force Delete Hobby By Id ( Forever )',
        },
      },
    },
  },
}
