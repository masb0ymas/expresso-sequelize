import BaseResponse from './BaseResponse'

class Forbidden extends BaseResponse {
  constructor(message: string) {
    super(message, 403)
  }
}

export default Forbidden
