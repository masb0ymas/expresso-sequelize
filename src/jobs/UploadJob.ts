import {
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  GCP_PROJECT_ID,
  GCS_BUCKET_NAME,
} from '@config/env'
import UploadService from '@controllers/Upload/service'
import { logServer } from '@expresso/helpers/Formatter'
import cron from 'node-cron'

class UploadJob {
  /**
   * Get Example Task
   */
  public static getTask(): cron.ScheduledTask {
    // Run this job every 2:00 am
    const task = cron.schedule('*/15 2 * * *', async () => {
      // Update Signed URL from Aws S3
      if (AWS_ACCESS_KEY && AWS_SECRET_KEY) {
        await UploadService.updateSignedUrlS3()
      }

      // Update Signed URL from GCS
      if (GCP_PROJECT_ID && GCS_BUCKET_NAME) {
        await UploadService.updateSignedUrlGCS()
      }

      const msgType = `Cron Job:`
      const message = 'Running task every 15 minutes at 2:00 am'

      console.log(logServer(msgType, message))
    })

    return task
  }
}

export default UploadJob
