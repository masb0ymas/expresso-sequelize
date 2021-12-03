import UploadService from '@controllers/Upload/service'
import { logServer } from '@expresso/helpers/Formatter'
import cron from 'node-cron'

class UploadJob {
  /**
   * Get Example Task
   */
  public static getTask(): cron.ScheduledTask {
    // Run this job every 2:00 am
    const task = cron.schedule('0 2 * * *', async () => {
      // update signed url
      await UploadService.updateSignedUrl()

      const msgType = `Cron Job:`
      const message = 'Running task every 2:00 am'

      console.log(logServer(msgType, message))
    })

    return task
  }
}

export default UploadJob
