type DataResponse<T> = {
  message?: string
  code?: number
} & T

class HttpResponse {
  /**
   * Base Response
   * @param dataResponse
   * @returns
   */
  private static baseResponse<T>(dataResponse: DataResponse<T>): {
    code: number
    message: string
  } & Omit<DataResponse<T>, 'message' | 'code'> {
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
   * Response Get or Sucess
   * @param dataResponse
   * @returns
   */
  public static get<T>(dataResponse: DataResponse<T>): {
    code: number
    message: string
  } & Omit<DataResponse<T>, 'message' | 'code'> {
    return this.baseResponse(dataResponse)
  }

  /**
   * Response Created
   * @param dataResponse
   * @returns
   */
  public static created<T>(dataResponse: DataResponse<T>): {
    code: number
    message: string
  } & Omit<DataResponse<T>, 'message' | 'code'> {
    return this.baseResponse({
      code: 201,
      message: 'data has been added!',
      ...dataResponse,
    })
  }

  /**
   * Response Updated
   * @param dataResponse
   * @returns
   */
  public static updated<T>(dataResponse: DataResponse<T>): {
    code: number
    message: string
  } & Omit<DataResponse<T>, 'message' | 'code'> {
    return this.baseResponse({
      message: 'the data has been updated!',
      ...dataResponse,
    })
  }

  /**
   * Response Deleted
   * @param dataResponse
   * @returns
   */
  public static deleted<T>(dataResponse: DataResponse<T>): {
    code: number
    message: string
  } & Omit<DataResponse<T>, 'message' | 'code'> {
    return this.baseResponse({
      message: 'data has been deleted!',
      ...dataResponse,
    })
  }
}

export default HttpResponse
