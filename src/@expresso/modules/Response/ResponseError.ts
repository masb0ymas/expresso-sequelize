import BaseResponse from '@expresso/modules/Errors/BaseResponse'
import BadRequest from '@expresso/modules/Errors/BadRequest'
import NotFound from '@expresso/modules/Errors/NotFound'
import Forbidden from '@expresso/modules/Errors/Forbidden'
import Unauthorized from '@expresso/modules/Errors/Unauthorized'
import InternalServer from '@expresso/modules/Errors/InternalServer'

const ResponseError = {
  BaseResponse,
  BadRequest,
  NotFound,
  Forbidden,
  Unauthorized,
  InternalServer,
}

export default ResponseError
