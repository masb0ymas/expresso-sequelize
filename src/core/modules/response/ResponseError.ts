import BadRequest from '../errors/BadRequest'
import BaseResponse from '../errors/BaseResponse'
import Forbidden from '../errors/Forbidden'
import InternalServer from '../errors/InternalServer'
import NotFound from '../errors/NotFound'
import Unauthorized from '../errors/Unauthorized'

const ResponseError = {
  BadRequest,
  BaseResponse,
  Forbidden,
  InternalServer,
  NotFound,
  Unauthorized,
}

export default ResponseError
