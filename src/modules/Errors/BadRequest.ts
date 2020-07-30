import BaseResponse from './BaseResponse'

class BadRequest extends BaseResponse {
  constructor(message: string) {
    super(message, 400)
    Object.setPrototypeOf(this, BadRequest.prototype)
  }
}

export default BadRequest
