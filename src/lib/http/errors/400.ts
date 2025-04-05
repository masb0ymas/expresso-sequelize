import BaseResponse from './base'

class BadRequest extends BaseResponse {
  constructor(message: string) {
    super(message, 'Bad Request', 400)
    Object.setPrototypeOf(this, BadRequest.prototype)
  }
}

export default BadRequest
