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
      summary: 'Delete User By Id',
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
          description: 'Delete User By Id',
        },
      },
    },
  },
}
