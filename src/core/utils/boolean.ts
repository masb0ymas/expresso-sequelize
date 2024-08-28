import { env } from '~/config/env'

/**
 * Check Storage Exists
 * @returns
 */
export function storageExists() {
  let is_storage = false

  const checkAccess = env.STORAGE_ACCESS_KEY && env.STORAGE_SECRET_KEY

  if (env.STORAGE_PROVIDER === 'minio') {
    is_storage = env.STORAGE_HOST && env.STORAGE_BUCKET_NAME && checkAccess
  } else if (env.STORAGE_PROVIDER === 's3') {
    is_storage = env.STORAGE_BUCKET_NAME && checkAccess
  } else if (env.STORAGE_PROVIDER === 'gcs') {
    is_storage = env.STORAGE_ACCESS_KEY && env.STORAGE_BUCKET_NAME
  }

  return is_storage
}
