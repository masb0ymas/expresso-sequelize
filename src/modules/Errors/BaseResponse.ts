class BaseResponse extends Error {
  public statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.message = message
    this.statusCode = statusCode
    Object.setPrototypeOf(this, BaseResponse.prototype)
  }
}

export default BaseResponse
