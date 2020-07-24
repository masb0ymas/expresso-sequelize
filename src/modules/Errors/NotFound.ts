import BaseResponse from './BaseResponse'

class NotFound extends BaseResponse {
  constructor(message: string) {
    super(message, 404)
  }
}

export default NotFound
