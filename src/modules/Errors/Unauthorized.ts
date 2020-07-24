import BaseResponse from './BaseResponse'

class Unauthorized extends BaseResponse {
  constructor(message: string) {
    super(message, 401)
  }
}

export default Unauthorized
