module.exports = {
  '/upload': {
    get: {
      tags: ['App - Upload'],
      summary: 'Get All Upload',
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
          description: 'Get All Upload',
        },
      },
    },
    post: {
      tags: ['App - Upload'],
      summary: 'Create New Upload',
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
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file_upload: {
                  type: 'string',
                  format: 'binary',
                },
              },
              required: ['file_upload'],
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
  '/upload/presign-url': {
    post: {
      tags: ['App - Upload'],
      summary: 'Presigned URL from Storage Provider',
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
                key_file: {
                  type: 'string',
                },
              },
              required: ['key_file'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Presigned URL from Storage Provider',
        },
      },
    },
  },
  '/upload/multiple/restore': {
    post: {
      tags: ['App - Upload'],
      summary: 'Multiple Restore Upload',
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
          description: 'Multiple Restore Upload',
        },
      },
    },
  },
  '/upload/multiple/soft-delete': {
    post: {
      tags: ['App - Upload'],
      summary: 'Multiple Soft Delete Upload',
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
          description: 'Multiple Soft Delete Upload',
        },
      },
    },
  },
  '/upload/multiple/force-delete': {
    post: {
      tags: ['App - Upload'],
      summary: 'Multiple Force Delete Upload ( Forever )',
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
          description: 'Multiple Force Delete Upload ( Forever )',
        },
      },
    },
  },
  '/upload/{id}': {
    get: {
      tags: ['App - Upload'],
      summary: 'Get Upload By Id',
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
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      responses: {
        200: {
          description: 'Get Upload By Id',
        },
      },
    },
    put: {
      tags: ['App - Upload'],
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
        {
          $ref: '#/components/parameters/lang',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file_upload: {
                  type: 'string',
                  format: 'binary',
                },
              },
              required: ['file_upload'],
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
      tags: ['App - Upload'],
      summary: 'Restore Upload By Id',
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
        {
          $ref: '#/components/parameters/lang',
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
      tags: ['App - Upload'],
      summary: 'Soft Delete Upload By Id',
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
        {
          $ref: '#/components/parameters/lang',
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
      tags: ['App - Upload'],
      summary: 'Force Delete Upload By Id ( Forever )',
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
        {
          $ref: '#/components/parameters/lang',
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
