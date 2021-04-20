type DataResponse<T> = {
  message?: string
  code?: number
} & T

class BuildResponse {
  private static baseResponse<T>(dataResponse: DataResponse<T>) {
    const {
      message = 'data has been received!',
      code = 200,
      ...rest
    } = dataResponse
    return {
      code,
      message,
      ...rest,
    }
  }

  /**
   * Response Success
   */
  public static get<T>(dataResponse: DataResponse<T>) {
    return this.baseResponse(dataResponse)
  }

  /**
   * Response Create
   */
  public static created<T>(dataResponse: DataResponse<T>) {
    return this.baseResponse({
      code: 201,
      message: 'data has been added!',
      ...dataResponse,
    })
  }

  /**
   * Response Update
   */
  public static updated<T>(dataResponse: DataResponse<T>) {
    return this.baseResponse({
      message: 'the data has been updated!',
      ...dataResponse,
    })
  }

  /**
   * Response Delete
   */
  public static deleted<T>(dataResponse: DataResponse<T>) {
    return this.baseResponse({
      message: 'data has been deleted!',
      ...dataResponse,
    })
  }
}

export default BuildResponse
