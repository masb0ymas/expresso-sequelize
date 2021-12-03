import { logServer } from '@expresso/helpers/Formatter'
import cron from 'node-cron'

class ExampleJob {
  /**
   * Get Example Task
   */
  public static getTask(): cron.ScheduledTask {
    // Run this job every midnight
    const task = cron.schedule('59 23 * * *', async () => {
      const msgType = `Cron Job:`
      const message = 'Running task every midnight'

      console.log(logServer(msgType, message))
    })

    return task
  }
}

export default ExampleJob
