import ErrorResponse from '~/lib/http/errors'
import { useQuery } from '~/lib/query-builder'
import { validate } from '~/lib/validate'
import { AppDataSource } from '../database/connection'
import { User } from '../database/entity/user'
import { changePasswordSchema, ChangePasswordSchema, userSchema } from '../database/schema/user'
import BaseService from './base'
import { DtoFindAll, FindParams } from './types'

export default class UserService extends BaseService<User> {
  constructor() {
    super({
      repository: AppDataSource.getRepository(User),
      schema: userSchema,
      model: 'user',
    })
  }

  /**
   * Find all with relations
   */
  async findWithRelations({
    page,
    pageSize,
    filtered = [],
    sorted = [],
  }: FindParams): Promise<DtoFindAll<User>> {
    const query = this.repository
      .createQueryBuilder(this._model)
      .leftJoinAndSelect(`${this._model}.role`, 'role')
      .leftJoinAndSelect(`${this._model}.upload`, 'upload')
      .leftJoinAndSelect(`${this._model}.sessions`, 'sessions')

    const newQuery = useQuery({
      query,
      model: this._model,
      reqQuery: { page, pageSize, filtered, sorted },
    })

    const data = await newQuery.getMany()
    const total = await newQuery.getCount()

    return { data, total }
  }

  /**
   * Find by id with relation
   */
  async findByIdWithRelation(id: string) {
    const newId = validate.uuid(id)
    const record = await this._findOne({
      where: { id: newId },
      relations: ['role', 'upload', 'sessions'],
    })

    return record
  }

  /**
   * Check email
   */
  async checkEmail(email: string) {
    const record = await this.repository.findOne({ where: { email } })

    if (record) {
      throw new ErrorResponse.BadRequest('email already exists')
    }
  }

  /**
   * Change password
   */
  async changePassword(id: string, formData: ChangePasswordSchema) {
    const newId = validate.uuid(id)
    const values = changePasswordSchema.parse(formData)

    const record = await this.repository.findOne({
      select: ['id', 'email', 'password', 'is_active', 'role_id'],
      where: { id: newId },
    })

    if (!record) {
      throw new ErrorResponse.NotFound('user not found')
    }

    const isPasswordMatch = await record.comparePassword(values.current_password)
    if (!isPasswordMatch) {
      throw new ErrorResponse.BadRequest('current password is incorrect')
    }

    // update password
    await this.repository.save({
      ...record,
      password: values.new_password,
    })
  }
}
