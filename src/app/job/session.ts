import cronstrue from 'cronstrue'
import cron from 'node-cron'
import { env } from '~/config/env'
import { logger } from '~/config/logger'
import SessionService from '../service/session'

const service = new SessionService()

export default class SessionJob {
  static removeSession() {
    let cronExpression: string

    if (env.NODE_ENV === 'production') {
      cronExpression = '*/30 * * * *'
    } else {
      cronExpression = '*/5 * * * *'
    }

    const task = cron.schedule(cronExpression, () => {
      service.deleteExpiredSession()
      logger.info(`Schedule remove session, schedule at ${cronstrue.toString(cronExpression)}`)
    })

    return task
  }
}
