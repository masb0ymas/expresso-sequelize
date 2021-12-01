import UploadService from '@controllers/Upload/service'
import cron from 'node-cron'

class UploadJob {
  /**
   * Get Example Task
   */
  public static getTask(): cron.ScheduledTask {
    // Run this job every 2:00 am
    const task = cron.schedule('0 2 * * *', async () => {
      await UploadService.updateSignedUrl()

      console.log('Running task every 2:00 am')
    })

    return task
  }
}

export default UploadJob
