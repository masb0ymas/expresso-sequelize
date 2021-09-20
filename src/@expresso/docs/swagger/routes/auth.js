module.exports = {
  '/auth/sign-up': {
    post: {
      tags: ['Auth'],
      summary: 'Create New Account',
      requestBody: {
        required: true,
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
                lastName: {
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
              },
              required: [
                'firstName',
                'lastName',
                'email',
                'newPassword',
                'confirmNewPassword',
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
      tags: ['Auth'],
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
      tags: ['Auth'],
      summary: 'Verify Session',
      produces: ['application/json'],
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
      tags: ['Auth'],
      summary: 'Logout',
      produces: ['application/json'],
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
                UserId: {
                  type: 'string',
                },
              },
              required: ['UserId'],
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
