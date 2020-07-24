class BaseResponse extends Error {
  public statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }
}

export default BaseResponse
