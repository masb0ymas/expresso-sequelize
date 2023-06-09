module.exports = {
  'Account - Session': {
    type: 'object',
    properties: {
      id: { type: 'string' },
      user_id: { type: 'string' },
      token: { type: 'string' },
      ip_address: { type: 'string' },
      device: { type: 'string' },
      platform: { type: 'string' },
      created_at: { type: 'string', format: 'date' },
      updated_at: { type: 'string', format: 'date' },
      deleted_at: { type: 'string', format: 'date' },
    },
  },
}
