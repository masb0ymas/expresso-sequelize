import { subDays } from 'date-fns'
import { Model, ModelStatic, Op } from 'sequelize'
import ErrorResponse from '~/lib/http/errors'
import { validate } from '~/lib/validate'
import Session from '../database/entity/session'
import { SessionSchema, sessionSchema } from '../database/schema/session'
import BaseService from './base'

// Define a type that ensures Session is recognized as a Sequelize Model
type SessionModel = Session & Model

type FindByUserTokenParams = {
  user_id: string
  token: string
}

export default class SessionService extends BaseService<SessionModel> {
  constructor() {
    super({
      repository: Session as unknown as ModelStatic<SessionModel>,
      schema: sessionSchema,
      model: 'session',
    })
  }

  /**
   * Create or update session
   */
  async createOrUpdate(formData: SessionSchema) {
    const values = sessionSchema.parse(formData)
    const session = await this.repository.findOne({ where: { user_id: values.user_id } })

    if (session) {
      await session.update({ ...session, ...values })
    }

    await this.repository.create(values)
  }

  /**
   * Find by user token
   */
  async findByUserToken({ user_id, token }: FindByUserTokenParams): Promise<Session> {
    const newUserId = validate.uuid(user_id)
    const record = await this.repository.findOne({ where: { user_id: newUserId, token } })

    if (!record) {
      throw new ErrorResponse.NotFound('session not found')
    }

    return record
  }

  /**
   * Find by token
   */
  async findByToken(token: string): Promise<Session> {
    const record = await this.repository.findOne({ where: { token } })

    if (!record) {
      throw new ErrorResponse.NotFound('session not found')
    }

    return record
  }

  /**
   * Delete by user token
   */
  async deleteByUserToken({ user_id, token }: FindByUserTokenParams): Promise<void> {
    const newUserId = validate.uuid(user_id)
    await this.repository.destroy({ where: { user_id: newUserId, token } })
  }

  /**
   * Delete expired session
   */
  async deleteExpiredSession() {
    const subSevenDays = subDays(new Date(), 7)
    await this.repository.destroy({ where: { created_at: { [Op.lte]: subSevenDays } } })
  }
}
