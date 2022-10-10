module.exports = {
  Upload: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      keyFile: { type: 'string' },
      filename: { type: 'string' },
      mimetype: { type: 'string' },
      size: { type: 'integer', format: 'int32' },
      signedURL: { type: 'string' },
      expiryDateURL: { type: 'string' },
    },
  },
}
