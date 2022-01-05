import userSchema from '@controllers/Account/User/schema'
import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import bcrypt from 'bcrypt'
import { DataTypes, Model, Optional } from 'sequelize'
import db from './_instance'

// entity
export interface UserAttributes {
  id: string
  firstName: string
  lastName: string
  phone?: string | null
  email: string
  password?: string | null
  isActive?: boolean | null
  isBlocked?: boolean | null
  tokenVerify?: string | null
  picturePath?: string | null
  RoleId: string
  newPassword?: string
  confirmNewPassword?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export interface UserLoginAttributes {
  uid: string
}

export interface TokenAttributes {
  data: UserAttributes
  message: string
}

export type LoginAttributes = Pick<UserAttributes, 'email' | 'password'>

// creation attributes
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// instance
export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  comparePassword: (password: string) => Promise<boolean>
}

// class entity
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string
  declare firstName: string
  declare lastName: string
  declare phone?: string | null | undefined
  declare email: string
  declare password?: string | null | undefined
  declare isActive?: boolean | null | undefined
  declare isBlocked?: boolean | null | undefined
  declare tokenVerify?: string | null | undefined
  declare picturePath?: string | null | undefined
  declare RoleId: string
  declare newPassword?: string | undefined
  declare confirmNewPassword?: string | undefined

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
  declare readonly deletedAt: Date

  comparePassword: (password: string) => Promise<boolean>
}

// init model
User.init(
  {
    ...SequelizeAttributes.Users,
    newPassword: {
      type: DataTypes.VIRTUAL,
    },
    confirmNewPassword: {
      type: DataTypes.VIRTUAL,
    },
  },
  {
    // @ts-expect-error
    sequelize: db.sequelize,
    tableName: 'Users',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['password', 'tokenVerify'],
      },
    },
    scopes: {
      withPassword: {},
    },
  }
)

/**
 *
 * @param instance
 */
function setUserPassword(instance: UserInstance): void {
  const { newPassword, confirmNewPassword } = instance
  const saltRounds = 10

  if (newPassword ?? confirmNewPassword) {
    const formPassword = { newPassword, confirmNewPassword }
    const validPassword = userSchema.createPassword.validateSyncAt(
      'confirmNewPassword',
      formPassword
    )

    // @ts-expect-error
    const hash = bcrypt.hashSync(validPassword, saltRounds)
    instance.setDataValue('password', hash)
  }
}

User.addHook('beforeCreate', setUserPassword)
User.addHook('beforeUpdate', setUserPassword)

User.prototype.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    void bcrypt.compare(
      candidatePassword,
      String(this.password),
      function (err, isMatch) {
        if (err) reject(err)
        resolve(isMatch)
      }
    )
  })
}

export default User
