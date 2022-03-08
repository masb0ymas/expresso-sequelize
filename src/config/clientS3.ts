import {
  GetBucketAclCommand,
  GetBucketAclCommandOutput,
  S3,
} from '@aws-sdk/client-s3'
import { logErrServer, logServer } from '@expresso/helpers/Formatter'
import chalk from 'chalk'
import { addDays } from 'date-fns'
import ms from 'ms'
import {
  AWS_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_S3_EXPIRED,
  AWS_SECRET_KEY,
} from './env'

export const clientS3 = new S3({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
  region: AWS_REGION,
})

const bucketName = chalk.cyan(AWS_BUCKET_NAME)

// Create AWS S3 Bucket
function createS3Bucket(): void {
  clientS3.createBucket({ Bucket: AWS_BUCKET_NAME }, function (err, data) {
    if (err) {
      console.log(logErrServer('Aws S3 Error:', err))

      process.exit(1)
    } else {
      const msgType = `Aws S3`
      const message = `Success create bucket : ${bucketName}`

      console.log(logServer(msgType, message), data?.Location)
    }
  })
}

// Initial AWS S3
const initialAwsS3 = async (): Promise<
  GetBucketAclCommandOutput | undefined
> => {
  try {
    // initial bucket
    const data = await clientS3.send(
      new GetBucketAclCommand({ Bucket: AWS_BUCKET_NAME })
    )

    const msgType = `Aws S3`
    const message = `Success Get Bucket : ${bucketName}`

    console.log(logServer(msgType, message), data.Grants)

    return data
  } catch (err) {
    const errType = `Aws S3 Error:`
    const message = `${err}`

    console.log(logErrServer(errType, message))

    // create bucket if doesn't exist
    createS3Bucket()
  }
}

const getNumberExpires = AWS_S3_EXPIRED.replace(/[^0-9]/g, '')
const getMilliSecondExpires = ms(AWS_S3_EXPIRED)

// S3 Object Expired ( 7 days )
export const s3ObjectExpired = Number(getMilliSecondExpires) / 1000

// S3 Expires in 7 days
export const s3ExpiresDate = addDays(new Date(), Number(getNumberExpires))

export default initialAwsS3
