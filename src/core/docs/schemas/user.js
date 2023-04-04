module.exports = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      fullname: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' },
      password: { type: 'string' },
      tokenVerify: { type: 'string' },
      isActive: { type: 'boolean' },
      isBlocked: { type: 'boolean' },
      UploadId: { type: 'string' },
      RoleId: { type: 'string' },
      createdAt: { type: 'string', format: 'date' },
      updatedAt: { type: 'string', format: 'date' },
      deletedAt: { type: 'string', format: 'date' },
    },
  },
}
