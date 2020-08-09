/* eslint-disable no-unused-vars */
import models from 'models'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import useValidation from 'helpers/useValidation'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import createDirNotExist from 'utils/Directory'
import { getUniqueCodev2, getToken } from 'helpers/CommonHelper'
import { LoginInterface } from 'models/user'
import ResponseError from 'modules/ResponseError'
import schema from '../User/schema'

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
    './public/uploads/excel',
    `./public/uploads/profile/${UserId}`,
  ]

  pathDirectory.map((x) => createDirNotExist(x))
}

routes.post(
  '/auth/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
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

    return res.status(201).json({
      data,
      message:
        'Registrasi berhasil, Check email Anda untuk langkah selanjutnya!',
    })
  })
)

routes.post(
  '/auth/sign-in',
  asyncHandler(async function signIn(req: Request, res: Response) {
    const { email, password } = useValidation(schema.login, req.getBody())

    const userData = await User.scope('withPassword').findOne({
      where: { email },
    })

    if (!userData) {
      throw new ResponseError.NotFound('Data tidak ditemukan!')
    }

    /* User active proses login */
    if (userData.active) {
      // @ts-ignore
      const comparePassword = await userData.comparePassword(password)

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

        return res.status(200).json({
          token: `JWT ${token}`,
          uid: userData.id,
        })
      }

      throw new ResponseError.BadRequest('Email atau password salah!')
    }

    /* User not active return error confirm email */
    throw new ResponseError.BadRequest(
      'Please check your email account to verify your email and continue the registration process.'
    )
  })
)

routes.get(
  '/profile',
  asyncHandler(async function getProfile(req: Request, res: Response) {
    const token = getToken(req.getHeaders())

    if (token) {
      const decodeToken: any = jwt.decode(token)
      const including = [{ model: Role }]

      const data = await User.findByPk(decodeToken?.id, { include: including })
      return res.status(200).json({ data })
    }

    throw new ResponseError.Unauthorized('Unauthorized. Please Re-login...')
  })
)
