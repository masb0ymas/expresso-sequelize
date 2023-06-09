module.exports = {
  'Account - Role': {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      created_at: { type: 'string', format: 'date' },
      updated_at: { type: 'string', format: 'date' },
      deleted_at: { type: 'string', format: 'date' },
    },
  },
}
