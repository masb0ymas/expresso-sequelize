module.exports = {
  '/auth/sign-up': {
    post: {
      tags: ['Account - Auth'],
      summary: 'Create New Account',
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
                new_password: {
                  type: 'string',
                  format: 'password',
                },
                confirm_new_password: {
                  type: 'string',
                  format: 'password',
                },
                phone: {
                  type: 'string',
                },
                roleAs: {
                  type: 'string',
                  enum: ['USER'],
                },
              },
              required: [
                'fullname',
                'email',
                'new_password',
                'confirm_new_password',
                'roleAs',
              ],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Create New Account',
        },
      },
    },
  },
  '/auth/sign-in': {
    post: {
      tags: ['Account - Auth'],
      summary: 'Login Your Account',
      requestBody: {
        required: true,
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                  format: 'password',
                },
                latitude: {
                  type: 'string',
                },
                longitude: {
                  type: 'string',
                },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login Your Account',
        },
      },
    },
  },
  '/auth/verify-session': {
    get: {
      tags: ['Account - Auth'],
      summary: 'Verify Session',
      security: [
        {
          auth_token: [],
        },
      ],
      responses: {
        200: {
          description: 'Verify Session',
        },
      },
    },
  },
  '/logout': {
    post: {
      tags: ['Account - Auth'],
      summary: 'Logout',
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
                user_id: {
                  type: 'string',
                },
              },
              required: ['user_id'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Terminate your api access',
        },
      },
    },
  },
}
