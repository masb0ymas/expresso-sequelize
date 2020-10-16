/* eslint-disable no-unused-vars */
import { Model, Optional, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import SequelizeAttributes from 'utils/SequelizeAttributes'
import schemaUser from 'controllers/User/schema'
import db from './_instance'

export interface UserAttributes {
  id: string
  fullName: string
  email: string
  password?: string
  phone: string
  active?: boolean | null
  tokenVerify?: string | null
  newPassword?: string
  confirmNewPassword?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface TokenAttributes {
  data: UserAttributes
  message: string
}

export interface LoginAttributes {
  email: string
  password: string
}

function setUserPassword(instance: UserInstance) {
  const { newPassword, confirmNewPassword } = instance
  const fdPassword = { newPassword, confirmNewPassword }
  const validPassword = schemaUser.createPassword.validateSyncAt(
    'confirmNewPassword',
    fdPassword
  )
  const saltRounds = 10
  const hash = bcrypt.hashSync(validPassword, saltRounds)
  instance.setDataValue('password', hash)
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  comparePassword(): boolean | void
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
    hooks: {
      beforeCreate(instance: UserInstance) {
        setUserPassword(instance)
      },
      beforeUpdate(instance: UserInstance) {
        const { newPassword, confirmNewPassword } = instance
        if (newPassword || confirmNewPassword) {
          setUserPassword(instance)
        }
      },
    },
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
  User.belongsToMany(models.Role, { through: models.UserRole })
}

export default User
