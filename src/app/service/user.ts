import { Includeable, Model, ModelStatic } from 'sequelize'
import ErrorResponse from '~/lib/http/errors'
import { useQuery } from '~/lib/query-builder'
import { validate } from '~/lib/validate'
import Role from '../database/entity/role'
import Session from '../database/entity/session'
import Upload from '../database/entity/upload'
import User from '../database/entity/user'
import { changePasswordSchema, ChangePasswordSchema, userSchema } from '../database/schema/user'
import BaseService from './base'
import { DtoFindAll, FindParams } from './types'

// Define a type that ensures User is recognized as a Sequelize Model
type UserModel = User & Model
type RoleModel = Role & Model
type UploadModel = Upload & Model
type SessionModel = Session & Model

const relations: Includeable[] = [
  { model: Role as unknown as ModelStatic<RoleModel> },
  { model: Upload as unknown as ModelStatic<UploadModel> },
  { model: Session as unknown as ModelStatic<SessionModel> },
]

export default class UserService extends BaseService<UserModel> {
  constructor() {
    super({
      repository: User as unknown as ModelStatic<UserModel>,
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
  }: FindParams): Promise<DtoFindAll<UserModel>> {
    const query = useQuery({
      model: this.repository,
      reqQuery: { page, pageSize, filtered, sorted },
      includeRule: relations,
    })

    const data = await this.repository.findAll({
      ...query,
      order: query.order ? query.order : [['created_at', 'desc']],
    })

    const total = await this.repository.count({
      include: query.includeCount,
      where: query.where,
    })

    return { data, total }
  }

  /**
   * Find by id with relation
   */
  async findByIdWithRelation(id: string) {
    const newId = validate.uuid(id)
    const record = await this._findOne({
      where: { id: newId },
      include: relations,
      rejectOnEmpty: true,
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
      attributes: ['id', 'email', 'password', 'is_active', 'role_id'],
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
    await record.update({ password: values.new_password })
  }
}
