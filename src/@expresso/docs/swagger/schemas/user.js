module.exports = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      fullName: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' },
      password: { type: 'string' },
      tokenVerify: { type: 'string' },
      isActive: { type: 'boolean' },
      isBlocked: { type: 'boolean' },
      UploadId: { type: 'string' },
      RoleId: { type: 'string' },
    },
  },
}
