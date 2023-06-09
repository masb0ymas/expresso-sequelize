module.exports = {
  'Account - User': {
    type: 'object',
    properties: {
      id: { type: 'string' },
      fullname: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' },
      password: { type: 'string' },
      token_verify: { type: 'string' },
      is_active: { type: 'boolean' },
      is_blocked: { type: 'boolean' },
      upload_id: { type: 'string' },
      role_id: { type: 'string' },
      created_at: { type: 'string', format: 'date' },
      updated_at: { type: 'string', format: 'date' },
      deleted_at: { type: 'string', format: 'date' },
    },
  },
}
