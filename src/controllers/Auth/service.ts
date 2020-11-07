/* eslint-disable no-unused-vars */
import path from 'path'
import models from 'models'
import jwt from 'jsonwebtoken'
import { isObject } from 'lodash'
import handlebars from 'handlebars'
import EmailProvider from 'config/email'
import schema from 'controllers/User/schema'
import createDirNotExist from 'utils/Directory'
import useValidation from 'helpers/useValidation'
import ResponseError from 'modules/Response/ResponseError'
import { BASE_URL_CLIENT } from 'config/baseClient'
import { getUniqueCodev2, readHTMLFile } from 'helpers/Common'
import { UserAttributes, LoginAttributes, TokenAttributes } from 'models/user'

const { User, Role } = models

const { JWT_SECRET }: any = process.env
const expiresToken = 7 * 24 * 60 * 60 // 7 Days

/*
  Create the main directory
  The directory will be created automatically when logged in,
  because there is a directory that uses a User ID
*/
async function createDirectory(UserId: string) {
  const pathDirectory = [
    './public/uploads/csv',
    './public/uploads/pdf',
    './public/uploads/excel',
    `./public/uploads/profile/${UserId}`,
  ]

  pathDirectory.map((x) => createDirNotExist(x))
}

interface EmailAttributes {
  email: string | any
  fullName: string
}

class AuthService {
  /**
   * Sign Up
   */
  public static async signUp(formData: UserAttributes) {
    const generateToken = {
      code: getUniqueCodev2(),
    }

    const tokenVerify = jwt.sign(
      JSON.parse(JSON.stringify(generateToken)),
      JWT_SECRET,
      {
        expiresIn: expiresToken,
      }
    ) // 1 Days

    const newFormData = { ...formData, tokenVerify }
    const value = useValidation(schema.create, newFormData)
    const data = await User.create(value)

    /*
      Initial Send an e-mail
    */
    const { email, fullName }: EmailAttributes = formData
    const pathTemplate = path.resolve(
      __dirname,
      `../../../public/templates/emails/register.html`
    )
    const subject = 'Verifikasi Email'
    const urlToken = `${BASE_URL_CLIENT}/email/verify?token=${tokenVerify}`
    const dataTemplate = { fullName, urlToken }
    const Email = new EmailProvider()

    readHTMLFile(pathTemplate, (error: Error, html: any) => {
      if (error) {
        throw new ResponseError.NotFound('email template not found')
      }

      const template = handlebars.compile(html)
      const htmlToSend = template(dataTemplate)
      Email.send(email, subject, htmlToSend)
    })

    return {
      message:
        'registration is successful, check your email for the next steps',
      data,
    }
  }

  /**
   * Sign In
   */
  public static async signIn(formData: LoginAttributes) {
    const { email, password } = formData
    const userData = await User.scope('withPassword').findOne({
      where: { email },
    })

    if (!userData) {
      throw new ResponseError.NotFound('data not found or has been deleted')
    }

    /* User active proses login */
    if (userData.active) {
      // @ts-ignore
      const comparePassword = userData.comparePassword(password)

      if (comparePassword) {
        // modif payload token
        const payloadToken = {
          id: userData.id,
          nama: userData.fullName,
          active: userData.active,
        }

        const token = jwt.sign(
          JSON.parse(JSON.stringify(payloadToken)),
          JWT_SECRET,
          {
            expiresIn: expiresToken,
          }
        ) // 1 Days

        // create directory
        await createDirectory(userData.id)

        return {
          token,
          expiresIn: expiresToken,
          tokenType: 'Bearer',
        }
      }

      throw new ResponseError.BadRequest('incorrect email or password!')
    }

    /* User not active return error confirm email */
    throw new ResponseError.BadRequest(
      'please check your email account to verify your email and continue the registration process.'
    )
  }

  /**
   * Profile
   */
  public static async profile(token: TokenAttributes) {
    if (isObject(token?.data)) {
      const decodeToken = token?.data
      const including = [{ model: Role }]

      // @ts-ignore
      const data = await User.findByPk(decodeToken?.id, { include: including })
      return data
    }

    throw new ResponseError.Unauthorized(
      `${token?.message}. Please Re-login...`
    )
  }
}

export default AuthService
