import cronstrue from 'cronstrue'
import cron from 'node-cron'
import { env } from '~/config/env'
import { logger } from '~/config/logger'
import UploadService from '../service/upload'

const service = new UploadService()

export default class UploadJob {
  static updateSignedUrl() {
    let cronExpression: string

    if (env.NODE_ENV === 'production') {
      cronExpression = '*/30 * * * *'
    } else {
      cronExpression = '*/5 * * * *'
    }

    const task = cron.schedule(cronExpression, () => {
      service.updateSignedUrl()
      logger.info(`Schedule update signed url, schedule at ${cronstrue.toString(cronExpression)}`)
    })

    return task
  }
}
