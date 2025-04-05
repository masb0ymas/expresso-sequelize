import BaseResponse from './base'

class Forbidden extends BaseResponse {
  constructor(message: string) {
    super(message, 'Forbidden', 403)
    Object.setPrototypeOf(this, Forbidden.prototype)
  }
}

export default Forbidden
