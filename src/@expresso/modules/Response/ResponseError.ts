import BadRequest from '@expresso/modules/Errors/BadRequest'
import BaseResponse from '@expresso/modules/Errors/BaseResponse'
import Forbidden from '@expresso/modules/Errors/Forbidden'
import InternalServer from '@expresso/modules/Errors/InternalServer'
import NotFound from '@expresso/modules/Errors/NotFound'
import Unauthorized from '@expresso/modules/Errors/Unauthorized'

const ResponseError = {
  BadRequest,
  BaseResponse,
  Forbidden,
  InternalServer,
  NotFound,
  Unauthorized,
}

export default ResponseError
