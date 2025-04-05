export type MulterConfig = {
  dest?: string
  allowed_ext?: string[]
  allowed_mimetype?: string[]
  limit?: {
    field_size?: number
    file_size?: number
  }
}
