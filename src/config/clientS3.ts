import {
  GetBucketAclCommand,
  GetBucketAclCommandOutput,
  S3,
} from '@aws-sdk/client-s3'
import { logErrServer, logServer } from '@expresso/helpers/Formatter'
import { addDays } from 'date-fns'
import dotenv from 'dotenv'
import ms from 'ms'

dotenv.config()

const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION }: any = process.env

export const clientS3 = new S3({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
  region: AWS_REGION ?? 'ap-southeast-1',
})

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME ?? 'expresso'

// Create AWS S3 Bucket
function createS3Bucket(): void {
  clientS3.createBucket({ Bucket: BUCKET_NAME }, function (err, data) {
    if (err) {
      console.log(logErrServer('Aws S3 Error:', err))

      process.exit(1)
    } else {
      const msgType = `Aws S3`
      const message = `Success create bucket ${data?.Location}`

      console.log(logServer(msgType, message))
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
      new GetBucketAclCommand({ Bucket: BUCKET_NAME })
    )

    const msgType = `Aws S3`
    const message = `Success Get Bucket, ${data.Grants}`

    console.log(logServer(msgType, message))

    return data
  } catch (err) {
    const errType = `Aws S3 Error:`
    const message = `${err}`

    console.log(logErrServer(errType, message))

    // create bucket if doesn't exist
    createS3Bucket()
  }
}

const AWS_S3_EXPIRED = process.env.AWS_S3_EXPIRED ?? '7d'

const getNumberExpires = AWS_S3_EXPIRED.replace(/[^0-9]/g, '')

// S3 Object Expired ( 7 days )
export const s3ObjectExpired = ms(AWS_S3_EXPIRED) / 1000

// S3 Expires in 7 days
export const s3ExpiresDate = addDays(new Date(), Number(getNumberExpires))

export default initialAwsS3
