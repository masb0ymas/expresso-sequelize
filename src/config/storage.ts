import { Storage } from 'expresso-provider'
import {
  type StorageExpires,
  type StorageType,
} from 'expresso-provider/lib/storage'
import { env } from './env'

/**
 * Initialize Storage Service Config
 */
export const storageService = new Storage({
  // Storage Provider support 'minio' | 's3' | 'gcs
  provider: env.STORAGE_PROVIDER as StorageType,

  // Storage Host for MinIO
  // host: env.STORAGE_HOST,

  // Storage Port for MinIO
  // port: env.STORAGE_PORT,

  // Storage Access Key
  accessKey: env.STORAGE_ACCESS_KEY,

  // Storage Secret Key
  secretKey: env.STORAGE_SECRET_KEY,

  // Storage Bucket Name
  bucket: env.STORAGE_BUCKET_NAME,

  // Storage Region support 'minio' | 's3' | 'gcs
  region: env.STORAGE_REGION,

  // Storage Sign Expired '1d' | '2d' | '3d' | '4d' | '5d' | '6d' | '7d'
  expires: env.STORAGE_SIGN_EXPIRED as StorageExpires,

  // Storage Options for MinIO
  // options: {
  //   // use this options for MinIO
  //   useSSL: true,

  //   // use this options for Google Cloud Storage ( serviceAccount.json )
  //   filePath: './your_path/serviceAccount.json',
  // },
})
