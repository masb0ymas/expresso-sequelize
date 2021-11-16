import {
  GetBucketAclCommand,
  GetBucketAclCommandOutput,
  S3,
} from '@aws-sdk/client-s3'
import chalk from 'chalk'

import dotenv from 'dotenv'

dotenv.config()

const { AWS_ACCESS_KEY, AWS_SECRET_KEY }: any = process.env

export const clientS3 = new S3({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
  region: 'ap-southeast-2',
})

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME ?? 'expresso'

function createS3Bucket(): void {
  clientS3.createBucket({ Bucket: BUCKET_NAME }, function (err, data) {
    if (err) {
      console.log(`${chalk.red('Aws S3 Err: ')}`, err)

      process.exit(1)
    } else {
      console.log(`${chalk.cyan('Success create bucket')}`, data?.Location)
    }
  })
}

export const initialAwsS3 = async (): Promise<
  GetBucketAclCommandOutput | undefined
> => {
  try {
    // initial bucket
    const data = await clientS3.send(
      new GetBucketAclCommand({ Bucket: BUCKET_NAME })
    )

    console.log(`${chalk.cyan('Success get bucket')}`, data.Grants)

    return data
  } catch (err) {
    console.log(err)

    // create bucket if doesn't exist
    createS3Bucket()
  }
}

export default initialAwsS3
