import BadRequest from './400'
import Unauthorized from './401'
import Forbidden from './403'
import NotFound from './404'
import InternalServer from './500'
import BaseResponse from './base'

const ErrorResponse = {
  BadRequest,
  BaseResponse,
  Forbidden,
  InternalServer,
  NotFound,
  Unauthorized,
}

export default ErrorResponse
