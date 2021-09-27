import userSchema from '@controllers/User/schema'
import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import bcrypt from 'bcrypt'
import { DataTypes, Model, Optional } from 'sequelize'
import { MyModels } from './index'
import db from './_instance'

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

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  comparePassword: (password: string) => Promise<boolean>
}

const User = db.sequelize.define<UserInstance>(
  'Users',
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
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}

User.associate = (models: MyModels) => {
  User.belongsTo(models.Role)
  User.hasMany(models.Session)
}

export default User
