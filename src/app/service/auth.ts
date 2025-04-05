import _ from 'lodash'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { env } from '~/config/env'
import { ConstRole } from '~/lib/constant/seed/role'
import ErrorResponse from '~/lib/http/errors'
import JwtToken from '~/lib/token/jwt'
import { validate } from '~/lib/validate'
import { AppDataSource } from '../database/connection'
import { Role } from '../database/entity/role'
import { Session } from '../database/entity/session'
import { User } from '../database/entity/user'
import { LoginSchema, loginSchema, UserLoginState, userSchema } from '../database/schema/user'
import SessionService from './session'
import { fromUnixTime } from 'date-fns'

type VerifySessionParams = {
  user_id: string
  token: string
}

type LogoutParams = VerifySessionParams

const jwt = new JwtToken({ secret: env.JWT_SECRET, expires: env.JWT_EXPIRES })
const sessionService = new SessionService()

export default class AuthService {
  private _repository: Repository<User>

  constructor() {
    this._repository = AppDataSource.getRepository(User)
  }

  /**
   * Register new user
   */
  async register(formData: any) {
    const uuid = uuidv4()

    const payload = JSON.parse(JSON.stringify({ uid: uuid }))
    const { token } = jwt.generate(payload)

    const values = userSchema.parse({
      ...formData,
      is_active: false,
      is_blocked: false,
      phone: validate.empty(formData.phone),
      token_verify: token,
      role_id: ConstRole.ID_USER,
      upload_id: null,
    })

    const formRegister: any = { ...values, password: validate.empty(formData.new_password) }
    const userEntity = new User()
    const data = await this._repository.save({ ...userEntity, ...formRegister })

    return data
  }

  /**
   * Login user
   */
  async login(formData: LoginSchema) {
    const values = loginSchema.parse(formData)
    let data: any

    await AppDataSource.transaction(async (entityManager) => {
      const repo = {
        user: entityManager.getRepository(User),
        role: entityManager.getRepository(Role),
        session: entityManager.getRepository(Session),
      }

      const getUser = await repo.user.findOne({
        select: ['id', 'fullname', 'email', 'password', 'is_active', 'role_id'],
        where: { email: values.email },
      })

      if (!getUser) {
        throw new ErrorResponse.NotFound('user not found')
      }

      if (!getUser.is_active) {
        throw new ErrorResponse.BadRequest('user is not active, please verify your email')
      }

      const isPasswordMatch = await getUser.comparePassword(values.password)
      if (!isPasswordMatch) {
        throw new ErrorResponse.BadRequest('current password is incorrect')
      }

      const getRole = await repo.role.findOne({ where: { id: getUser.role_id } })
      if (!getRole) {
        throw new ErrorResponse.NotFound('role not found')
      }

      const payload = JSON.parse(JSON.stringify({ uid: getUser.id }))
      const { token, expiresIn } = jwt.generate(payload)

      const sessionEntity = new Session()
      const formSession = { ...formData, user_id: getUser.id, token }

      // @ts-expect-error
      await repo.session.save({ ...sessionEntity, ...formSession })
      const is_admin = [ConstRole.ID_ADMIN, ConstRole.ID_SUPER_ADMIN].includes(getRole.id)

      data = {
        fullname: getUser.fullname,
        email: getUser.email,
        uid: getUser.id,
        access_token: token,
        expires_at: new Date(Date.now() + expiresIn * 1000),
        expires_in: expiresIn,
        is_admin,
      }
    })

    return data
  }

  /**
   * Verify user session
   */
  async verifySession({ user_id, token }: VerifySessionParams) {
    const user = await this._repository.findOne({ where: { id: user_id } })

    if (!user) {
      throw new ErrorResponse.NotFound('user not found')
    }

    const session = await sessionService.findByUserToken({ user_id, token })
    const decodeToken = jwt.verify(token)
    const userToken = decodeToken.data as UserLoginState

    if (!_.isEmpty(userToken.uid) && userToken.uid !== user_id) {
      throw new ErrorResponse.BadRequest('user id not match')
    }

    return { ...user, session }
  }

  /**
   * Logout user
   */
  async logout({ user_id, token }: LogoutParams) {
    const user = await this._repository.findOne({ where: { id: user_id } })

    if (!user) {
      throw new ErrorResponse.NotFound('user not found')
    }

    await sessionService.deleteByUserToken({ user_id, token })
    const message = 'logout successfully'

    return { message }
  }
}
