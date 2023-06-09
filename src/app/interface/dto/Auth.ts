export interface DtoLogin {
  tokenType: string
  user: {
    uid: string
  }
  fullname: string
  accessToken: string
  expiresIn: number
  message: string
}
