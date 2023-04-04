module.exports = {
  Session: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      UserId: { type: 'string' },
      token: { type: 'string' },
      ipAddress: { type: 'string' },
      device: { type: 'string' },
      platform: { type: 'string' },
      createdAt: { type: 'string', format: 'date' },
      updatedAt: { type: 'string', format: 'date' },
      deletedAt: { type: 'string', format: 'date' },
    },
  },
}
