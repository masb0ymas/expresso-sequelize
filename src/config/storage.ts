import { Storage } from 'expresso-provider'
import {
  type StorageExpires,
  type StorageType,
} from 'expresso-provider/lib/storage'
import {
  STORAGE_ACCESS_KEY,
  STORAGE_BUCKET_NAME,
  STORAGE_HOST,
  STORAGE_PROVIDER,
  STORAGE_REGION,
  STORAGE_SECRET_KEY,
  STORAGE_SIGN_EXPIRED,
} from './env'

const storageProvider = STORAGE_PROVIDER as StorageType
const storageSignExpired = STORAGE_SIGN_EXPIRED as StorageExpires

export const storageService = new Storage({
  provider: storageProvider,
  host: STORAGE_HOST,
  accessKey: String(STORAGE_ACCESS_KEY),
  secretKey: STORAGE_SECRET_KEY,
  bucket: STORAGE_BUCKET_NAME,
  region: STORAGE_REGION,
  expires: storageSignExpired,
  // options: {
  //   useSSL: true, // use this options for MinIO
  // },
})
