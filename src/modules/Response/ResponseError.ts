import BaseResponse from 'modules/Errors/BaseResponse'
import BadRequest from 'modules/Errors/BadRequest'
import NotFound from 'modules/Errors/NotFound'
import Forbidden from 'modules/Errors/Forbidden'
import Unauthorized from 'modules/Errors/Unauthorized'
import InternalServer from 'modules/Errors/InternalServer'

const ResponseError = {
  BaseResponse,
  BadRequest,
  NotFound,
  Forbidden,
  Unauthorized,
  InternalServer,
}

export default ResponseError
