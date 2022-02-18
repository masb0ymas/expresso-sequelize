module.exports = {
  '/notification': {
    get: {
      tags: ['Notification'],
      summary: 'Get All Notification',
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
          description: 'Get All Notification',
        },
      },
    },
    post: {
      tags: ['Notification'],
      summary: 'Create New Notification',
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
                UserId: {
                  type: 'string',
                },
                title: {
                  type: 'string',
                },
                text: {
                  type: 'string',
                },
                html: {
                  type: 'string',
                },
                type: {
                  type: 'string',
                  enum: ['all', 'user'],
                },
                isRead: {
                  type: 'boolean',
                },
                sendAt: {
                  type: 'string',
                },
                isSend: {
                  type: 'boolean',
                },
              },
              required: ['title', 'text', 'html', 'type'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Create New Notification',
        },
      },
    },
  },
  '/notification/multiple/soft-delete': {
    post: {
      tags: ['Notification'],
      summary: 'Multiple Soft Delete Notification',
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
          description: 'Multiple Soft Delete Notification',
        },
      },
    },
  },
  '/notification/multiple/restore': {
    post: {
      tags: ['Notification'],
      summary: 'Multiple Restore Notification',
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
          description: 'Multiple Restore Notification',
        },
      },
    },
  },
  '/notification/multiple/force-delete': {
    post: {
      tags: ['Notification'],
      summary: 'Multiple Force Delete Notification ( Forever )',
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
          description: 'Multiple Force Delete Notification ( Forever )',
        },
      },
    },
  },
  '/notification/{id}': {
    get: {
      tags: ['Notification'],
      summary: 'Get Notification By Id',
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
          description: 'Notification Id',
        },
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      responses: {
        200: {
          description: 'Get Notification By Id',
        },
      },
    },
    put: {
      tags: ['Notification'],
      summary: 'Update Data Notification',
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
          description: 'Notification Id',
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
                UserId: {
                  type: 'string',
                },
                title: {
                  type: 'string',
                },
                text: {
                  type: 'string',
                },
                html: {
                  type: 'string',
                },
                type: {
                  type: 'string',
                  enum: ['all', 'user'],
                },
                isRead: {
                  type: 'boolean',
                },
                sendAt: {
                  type: 'string',
                },
                isSend: {
                  type: 'boolean',
                },
              },
              required: ['title', 'text', 'html', 'type'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Update Data Notification',
        },
      },
    },
  },
  '/notification/soft-delete/{id}': {
    delete: {
      tags: ['Notification'],
      summary: 'Soft Delete Notification By Id',
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
          description: 'Notification Id',
        },
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      responses: {
        200: {
          description: 'Soft Delete Notification By Id',
        },
      },
    },
  },
  '/notification/restore/{id}': {
    put: {
      tags: ['Notification'],
      summary: 'Restore Notification By Id',
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
          description: 'Notification Id',
        },
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      responses: {
        200: {
          description: 'Restore Notification By Id',
        },
      },
    },
  },
  '/notification/force-delete/{id}': {
    delete: {
      tags: ['Notification'],
      summary: 'Force Delete Notification By Id ( Forever )',
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
          description: 'Notification Id',
        },
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      responses: {
        200: {
          description: 'Force Delete Notification By Id ( Forever )',
        },
      },
    },
  },
}
