module.exports = {
  '/user': {
    get: {
      tags: ['Account - User'],
      summary: 'Get All User',
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
          description: 'Get All User',
        },
      },
    },
    post: {
      tags: ['Account - User'],
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
                fullname: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                phone: {
                  type: 'string',
                },
                new_password: {
                  type: 'string',
                },
                confirm_new_password: {
                  type: 'string',
                },
                role_id: {
                  type: 'string',
                },
              },
              required: [
                'fullname',
                'email',
                'new_password',
                'confirm_new_password',
                'role_id',
              ],
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
  '/user/change-password': {
    post: {
      tags: ['Account - User'],
      summary: 'Change Password',
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
                current_password: {
                  type: 'string',
                },
                new_password: {
                  type: 'string',
                },
                confirm_new_password: {
                  type: 'string',
                },
              },
              required: [
                'current_password',
                'new_password',
                'confirm_new_password',
              ],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Change Password',
        },
      },
    },
  },
  '/user/multiple/restore': {
    post: {
      tags: ['Account - User'],
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
  '/user/multiple/soft-delete': {
    post: {
      tags: ['Account - User'],
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
  '/user/multiple/force-delete': {
    post: {
      tags: ['Account - User'],
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
  '/user/{id}': {
    get: {
      tags: ['Account - User'],
      summary: 'Get User By Id',
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
      tags: ['Account - User'],
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
                fullname: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                phone: {
                  type: 'string',
                },
                role_id: {
                  type: 'string',
                },
              },
              required: ['fullname', 'email', 'role_id'],
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
  },
  '/user/restore/{id}': {
    put: {
      tags: ['Account - User'],
      summary: 'Restore User By Id',
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
          description: 'Restore User By Id',
        },
      },
    },
  },
  '/user/soft-delete/{id}': {
    delete: {
      tags: ['Account - User'],
      summary: 'Soft Delete User By Id',
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
          description: 'Soft Delete User By Id',
        },
      },
    },
  },
  '/user/force-delete/{id}': {
    delete: {
      tags: ['Account - User'],
      summary: 'Force Delete User By Id ( Forever )',
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
          description: 'Force Delete User By Id ( Forever )',
        },
      },
    },
  },
}
