import models from 'models'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { RefreshTokenAttributes } from 'models/refreshtoken'
import schema from 'controllers/RefreshToken/schema'
import UserService from 'controllers/User/service'

const { RefreshToken } = models

class RefreshTokenService {
  /**
   *
   * @param token
   */
  public static async getToken(token: string) {
    const data = await RefreshToken.findOne({
      where: { token },
    })

    if (!data) {
      throw new ResponseError.NotFound('token not found or has been deleted')
    }

    return data
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: RefreshTokenAttributes) {
    const value = useValidation(schema.create, formData)

    const user = await UserService.getOne(formData.UserId)
    if (user) {
      const data = await RefreshToken.create(value)
      return data
    }

    throw new ResponseError.BadRequest('Something went wrong')
  }
}

export default RefreshTokenService
