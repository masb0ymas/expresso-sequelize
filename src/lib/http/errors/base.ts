class BaseResponse extends Error {
  public statusCode: number

  constructor(message: string, name = 'Internal Server', statusCode = 500) {
    super(message)
    this.message = message
    this.name = name
    this.statusCode = statusCode
    Object.setPrototypeOf(this, BaseResponse.prototype)
  }
}

export default BaseResponse
