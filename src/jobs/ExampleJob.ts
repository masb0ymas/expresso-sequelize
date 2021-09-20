import cron from 'node-cron'

class ExampleJob {
  /**
   * Get Example Task
   */
  public static getTask(): cron.ScheduledTask {
    // Run this job every midnight
    const task = cron.schedule('59 23 * * *', async () => {
      console.log('Running task every midnight')
    })

    return task
  }
}

export default ExampleJob
