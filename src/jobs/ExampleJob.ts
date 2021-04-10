import cron from 'node-cron'

class ExampleJob {
  /**
   * Get Example Task
   */
  public static getTask() {
    // Run this job every 30 minutes
    const task = cron.schedule('30 * * * *', async () => {
      console.log('Running task every 30 minutes')
    })

    return task
  }
}

export default ExampleJob
