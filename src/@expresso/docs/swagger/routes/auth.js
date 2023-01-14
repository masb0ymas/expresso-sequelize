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
                fullname: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                newPassword: {
                  type: 'string',
                  format: 'password',
                },
                confirmNewPassword: {
                  type: 'string',
                  format: 'password',
                },
                phone: {
                  type: 'string',
                },
              },
              required: [
                'fullname',
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
                  format: 'password',
                },
                deviceToken: {
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
