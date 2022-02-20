export interface DtoLogin {
  tokenType: string
  user: {
    uid: string
  }
  accessToken: string
  expiresIn: number
  message: string
}
