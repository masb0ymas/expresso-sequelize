module.exports = {
  '/user': {
    get: {
      tags: ['User'],
      summary: 'Get All User',
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
          description: 'Get All User',
        },
      },
    },
    post: {
      tags: ['User'],
      summary: 'Create New User',
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
                fullName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                newPassword: {
                  type: 'string',
                },
                confirmNewPassword: {
                  type: 'string',
                },
                phone: {
                  type: 'string',
                },
                Roles: {
                  type: 'string',
                  description: '["id_1", "id_2"]',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Create New User',
        },
      },
    },
  },
  '/user/multiple/soft-delete': {
    post: {
      tags: ['User'],
      summary: 'Multiple Soft Delete User',
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
          description: 'Multiple Soft Delete User',
        },
      },
    },
  },
  '/user/multiple/restore': {
    post: {
      tags: ['User'],
      summary: 'Multiple Restore User',
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
          description: 'Multiple Restore User',
        },
      },
    },
  },
  '/user/multiple/force-delete': {
    post: {
      tags: ['User'],
      summary: 'Multiple Force Delete User ( Forever )',
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
          description: 'Multiple Force Delete User ( Forever )',
        },
      },
    },
  },
  '/user/{id}/session': {
    get: {
      tags: ['User'],
      summary: 'Get User By Id with Session',
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
          description: 'User Id',
        },
      ],
      responses: {
        200: {
          description: 'Get User By Id with Session',
        },
      },
    },
  },
  '/user/{id}': {
    get: {
      tags: ['User'],
      summary: 'Get User By Id',
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
          description: 'User Id',
        },
      ],
      responses: {
        200: {
          description: 'Get User By Id',
        },
      },
    },
    put: {
      tags: ['User'],
      summary: 'Update Data User',
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
          description: 'User Id',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                fullName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                newPassword: {
                  type: 'string',
                },
                confirmNewPassword: {
                  type: 'string',
                },
                phone: {
                  type: 'string',
                },
                Roles: {
                  type: 'string',
                  description: '["id_1", "id_2"]',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Update Data User',
        },
      },
    },
    delete: {
      tags: ['User'],
      summary: 'Force Delete User By Id ( Forever )',
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
          description: 'User Id',
        },
      ],
      responses: {
        200: {
          description: 'Force Delete User By Id ( Forever )',
        },
      },
    },
  },
  '/user/restore/{id}': {
    put: {
      tags: ['User'],
      summary: 'Restore User By Id',
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
          description: 'User Id',
        },
      ],
      responses: {
        200: {
          description: 'Restore User By Id',
        },
      },
    },
  },
  '/user/delete/{id}': {
    delete: {
      tags: ['User'],
      summary: 'Soft Delete User By Id',
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
          description: 'User Id',
        },
      ],
      responses: {
        200: {
          description: 'Soft Delete User By Id',
        },
      },
    },
  },
}
