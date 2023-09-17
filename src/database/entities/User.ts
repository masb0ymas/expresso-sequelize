import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  DeletedAt,
  ForeignKey,
  HasMany,
  IsUUID,
  Scopes,
  Table,
  Unique,
} from 'sequelize-typescript'
import userSchema from '~/app/schema/user.schema'
import { hashing } from '~/config/hashing'
import Base, { type IBaseEntity } from './Base'
import Role from './Role'
import Session from './Session'
import Upload from './Upload'

interface UserEntity extends IBaseEntity {
  deleted_at?: Date | null
  fullname: string
  email: string
  password?: string | null
  phone?: string | null
  token_verify?: string | null
  is_active?: boolean | null
  is_blocked?: boolean | null
  upload_id?: string | null
  role_id: string

  // virtual field
  new_password?: string | null
  confirm_new_password?: string | null
}

export interface UserLoginAttributes {
  uid: string
}

export type CreatePassword = Pick<
  UserEntity,
  'new_password' | 'confirm_new_password'
>

export type LoginAttributes = Pick<UserEntity, 'email' | 'password'>

export type UserAttributes = Omit<
  UserEntity,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

@DefaultScope(() => ({
  attributes: {
    exclude: ['password', 'token_verify'],
  },
}))
@Scopes(() => ({
  withPassword: {},
}))
@Table({ tableName: 'user', paranoid: true })
class User extends Base {
  @DeletedAt
  @Column
  deleted_at?: Date

  @Column({ allowNull: false })
  fullname: string

  @Unique
  @Column({ allowNull: false })
  email: string

  @Column({ allowNull: false })
  password?: string

  @Column({ type: DataType.STRING('20') })
  phone?: string

  @Column({ type: DataType.TEXT })
  token_verify?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_active?: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_blocked?: boolean

  @IsUUID(4)
  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  role_id: string

  @BelongsTo(() => Role)
  role: Role

  @IsUUID(4)
  @ForeignKey(() => Upload)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  upload_id: string

  // many to one
  @BelongsTo(() => Upload)
  upload?: Upload

  // one to many
  @HasMany(() => Session)
  sessions: Session[]

  @Column({ type: DataType.VIRTUAL })
  new_password: string

  @Column({ type: DataType.VIRTUAL })
  confirm_new_password: string

  comparePassword: (current_password: string) => Promise<boolean>

  @BeforeUpdate
  @BeforeCreate
  static async setUserPassword(instance: User): Promise<void> {
    const { new_password, confirm_new_password } = instance

    if (new_password ?? confirm_new_password) {
      const formPassword = { new_password, confirm_new_password }
      const validPassword = userSchema.createPassword.parse(formPassword)

      const hash = await hashing.hash(validPassword.new_password)
      instance.setDataValue('password', hash)
    }
  }
}

// compare password
User.prototype.comparePassword = async function (
  current_password: string
): Promise<boolean> {
  const password = String(this.password)

  const compare = await hashing.verify(password, current_password)
  return compare
}

export default User
