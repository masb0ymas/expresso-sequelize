import { logErrServer, logServer } from '@expresso/helpers/Formatter'
import { Storage } from '@google-cloud/storage'
import chalk from 'chalk'
import { addDays } from 'date-fns'
import fs from 'fs'
import ms from 'ms'
import path from 'path'
import { GCP_PROJECT_ID, GCS_BUCKET_NAME, GCS_EXPIRED } from './env'

const serviceAccountKey = path.resolve('./gcp-serviceAccount.json')
const msgType = 'GCP - Service Account'

// check file exist
if (GCP_PROJECT_ID && !fs.existsSync(serviceAccountKey)) {
  console.log(logErrServer(msgType, 'is missing on root directory'))

  throw new Error(
    'Missing GCP Service Account!!!\nCopy gcp-serviceAccount from your console google to root directory "gcp-serviceAccount.json"'
  )
}

if (GCP_PROJECT_ID) {
  console.log(logServer(msgType, serviceAccountKey))
}

// storage client
export const storageClient = new Storage({
  projectId: GCP_PROJECT_ID,
  keyFilename: serviceAccountKey,
})

const bucketName = chalk.cyan(GCS_BUCKET_NAME)

async function createBucket(): Promise<void> {
  const msgType = `Google Cloud Storage`

  try {
    const data = await storageClient.createBucket(GCS_BUCKET_NAME)
    console.log(data)

    const message = `Success create bucket: ${bucketName}`

    console.log(logServer(msgType, message))
  } catch (err: any) {
    console.log(logErrServer(`${msgType} - Error:`, err))

    process.exit(1)
  }
}

// initial google cloud storage
export const initialGCS = async (): Promise<void> => {
  const msgType = `Google Cloud Storage`

  try {
    const data = storageClient.bucket(GCS_BUCKET_NAME)
    const getBucket = await data.exists()
    const getMetadata = await data.getMetadata()

    // check bucket
    if (getBucket[0]) {
      const message = `Success get bucket: ${bucketName}`

      console.log(logServer(msgType, message), getMetadata[0])
    }
  } catch (err) {
    const errType = `${msgType} - Error:`
    const message = `${err}`

    console.log(logErrServer(errType, message))

    await createBucket()
  }
}

const getExpires = GCS_EXPIRED.replace(/[^0-9]/g, '')

// S3 Object Expired ( 7 days )
export const gcsObjectExpired = ms(GCS_EXPIRED) / 1000

// S3 Expires in 7 days
export const gcsExpiresDate = addDays(new Date(), Number(getExpires))
