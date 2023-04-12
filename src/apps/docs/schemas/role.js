module.exports = {
  Role: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      createdAt: { type: 'string', format: 'date' },
      updatedAt: { type: 'string', format: 'date' },
      deletedAt: { type: 'string', format: 'date' },
    },
  },
}
