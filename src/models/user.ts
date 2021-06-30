import { Model, Optional, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import SequelizeAttributes from 'utils/SequelizeAttributes'
import userSchema from 'controllers/User/schema'
import db from './_instance'

export interface UserAttributes {
  id: string
  fullName: string
  email: string
  password?: string
  phone: string
  isActive?: boolean | null
  isBlocked?: boolean | null
  tokenVerify?: string | null
  newPassword?: string
  confirmNewPassword?: string
  picturePath?: string | null
  RoleId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export interface TokenAttributes {
  data: UserAttributes
  message: string
}

export interface LoginAttributes {
  email: string
  password: string
}

export interface EmailAttributes {
  email: string
  fullName: string
}

export interface UserLoginAttributes {
  uid: string
  lang: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  comparePassword(): Promise<boolean | void>
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

function setUserPassword(instance: UserInstance) {
  const { newPassword, confirmNewPassword } = instance
  const saltRounds = 10

  if (newPassword || confirmNewPassword) {
    const formPassword = { newPassword, confirmNewPassword }
    const validPassword = userSchema.createPassword.validateSyncAt(
      'confirmNewPassword',
      formPassword
    )

    // @ts-ignore
    const hash = bcrypt.hashSync(validPassword, saltRounds)
    instance.setDataValue('password', hash)
  }
}

User.addHook('beforeCreate', setUserPassword)
User.addHook('beforeUpdate', setUserPassword)

// Compare password
User.prototype.comparePassword = function (candidatePassword: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}

User.associate = (models) => {
  User.hasMany(models.Session, { foreignKey: 'UserId' })
  User.belongsTo(models.Role)
}

export default User
