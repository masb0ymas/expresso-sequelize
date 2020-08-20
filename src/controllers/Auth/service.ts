/* eslint-disable no-unused-vars */
import path from 'path'
import models from 'models'
import jwt from 'jsonwebtoken'
import { Request } from 'express'
import { isObject } from 'lodash'
import handlebars from 'handlebars'
import EmailProvider from 'config/email'
import schema from 'controllers/User/schema'
import createDirNotExist from 'utils/Directory'
import useValidation from 'helpers/useValidation'
import ResponseError from 'modules/ResponseError'
import { BASE_URL_CLIENT } from 'config/baseClient'
import { getUniqueCodev2, readHTMLFile } from 'helpers/Common'
import { LoginAttributes, TokenAttributes } from 'models/user'

const { User, Role } = models

const { JWT_SECRET }: any = process.env
const expiresToken = 86400 * 1 // 1 Days

/*
  Create the main directory
  direktori akan dibikin otomatis ketika login,
  karna direktori ada yang menggunakan User ID
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

class AuthService {
  /**
   * Sign Up
   */
  public static async signUp(req: Request) {
    const { email, fullName } = req.getBody()
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

    req.setBody({ tokenVerify })
    const value = useValidation(schema.create, req.getBody())
    const data = await User.create(value)

    // /*
    //   Initial Send an e-mail
    // */
    // const pathTemplate = path.resolve(
    //   __dirname,
    //   `../../../public/templates/emails/register.html`
    // )
    // const subject = 'Verifikasi Email'
    // const urlToken = `${BASE_URL_CLIENT}/email/verify?token=${tokenVerify}`
    // const dataTemplate = { fullName, urlToken }
    // const Email = new EmailProvider()

    // readHTMLFile(pathTemplate, (error: Error, html: any) => {
    //   if (error) {
    //     throw new ResponseError.NotFound('Email Template tidak ditemukan!')
    //   }

    //   const template = handlebars.compile(html)
    //   const htmlToSend = template(dataTemplate)
    //   Email.send(email, subject, htmlToSend)
    // })

    return {
      message:
        'Registrasi berhasil, Check email Anda untuk langkah selanjutnya!',
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
      throw new ResponseError.NotFound('Data tidak ditemukan!')
    }

    /* User active proses login */
    if (userData.active) {
      // @ts-ignore
      const comparePassword = userData.comparePassword(password)

      if (comparePassword) {
        const userDataJson = userData.toJSON()

        const token = jwt.sign(
          JSON.parse(JSON.stringify(userDataJson)),
          JWT_SECRET,
          {
            expiresIn: expiresToken,
          }
        ) // 1 Days

        // create directory
        await createDirectory(userData.id)

        return {
          token: `JWT ${token}`,
          expiresIn: expiresToken,
          tokenType: 'JWT',
          uid: userData.id,
        }
      }

      throw new ResponseError.BadRequest('Email atau password salah!')
    }

    /* User not active return error confirm email */
    throw new ResponseError.BadRequest(
      'Please check your email account to verify your email and continue the registration process.'
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
