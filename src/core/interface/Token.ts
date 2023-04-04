import { type JwtPayload } from 'jsonwebtoken'

export interface DtoGenerateToken {
  token: string
  expiresIn: number
}

export type DtoVerifyToken =
  | {
      data: null
      message: string
    }
  | {
      data: string | JwtPayload
      message: string
    }
  | undefined
