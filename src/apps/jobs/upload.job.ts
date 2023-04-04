import UploadService from '@apps/services/Upload/upload.service'
import { printLog } from 'expresso-core'
import cron from 'node-cron'

export class UploadJob {
  /**
   * Get Example Task
   */
  public static getTask(): cron.ScheduledTask {
    const cronExpression = '*/30 * * * *'

    // Run this job every 2:00 am
    const task = cron.schedule(cronExpression, async () => {
      // Update Signed URL Aws S3
      await UploadService.updateSignedURL()

      const msgType = `Cron Job:`
      const message = 'Running task every 30 minutes'

      const logMessage = printLog(msgType, message)
      console.log(logMessage)
    })

    return task
  }
}
