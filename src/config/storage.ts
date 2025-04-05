import Storage from '~/lib/storage'
import { S3StorageParams, StorageType } from '~/lib/storage/types'
import { env } from './env'

export const storage = Storage.create({
  storageType: env.STORAGE_PROVIDER as StorageType,
  params: {
    access_key: env.STORAGE_ACCESS_KEY,
    secret_key: env.STORAGE_SECRET_KEY,
    bucket: env.STORAGE_BUCKET_NAME,
    expires: env.STORAGE_SIGN_EXPIRED,
    region: env.STORAGE_REGION,
  } as S3StorageParams,
})
