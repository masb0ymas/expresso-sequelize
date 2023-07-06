import { green } from 'colorette'
import cron from 'node-cron'
import { env } from '~/config/env'
import { logger } from '~/config/pino'
import UploadService from '../service/upload.service'

export class UploadJob {
  /**
   * Get Example Task
   */
  public static getTask(): cron.ScheduledTask {
    let cronExpression: string

    if (env.NODE_ENV === 'production') {
      cronExpression = '*/30 * * * *'
    } else {
      cronExpression = '*/5 * * * *'
    }

    // Run this job every 2:00 am
    const task = cron.schedule(cronExpression, async () => {
      // Update Signed URL Aws S3
      await UploadService.updateSignedURL()

      const msgType = green(`cron job`)
      logger.info(`${msgType} - running task every 15 minutes at 2:00 am`)
    })

    return task
  }
}
