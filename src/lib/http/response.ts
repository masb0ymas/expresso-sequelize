type DataResponseEntity<TData> = {
  message?: string
  statusCode?: number
} & TData

type DtoHttpResponse<TData> = {
  statusCode: number
  message: string
} & Omit<DataResponseEntity<TData>, 'message' | 'statusCode'>

export default class HttpResponse {
  /**
   * Base Response
   * @param dataResponse
   * @returns
   */
  private static baseResponse<TData>(
    dataResponse: DataResponseEntity<TData>
  ): DtoHttpResponse<TData> {
    const { message = 'data has been received', statusCode = 200, ...rest } = dataResponse

    return { statusCode, message, ...rest }
  }

  /**
   * Response Get or Success
   * @param dataResponse
   * @returns
   */
  public static get<TData>(dataResponse: DataResponseEntity<TData>): DtoHttpResponse<TData> {
    const message = 'data has been received'

    return this.baseResponse({ message, ...dataResponse })
  }

  /**
   * Response Created
   * @param dataResponse
   * @returns
   */
  public static created<TData>(dataResponse: DataResponseEntity<TData>): DtoHttpResponse<TData> {
    const message = 'data has been created'

    return this.baseResponse({ statusCode: 201, message, ...dataResponse })
  }

  /**
   * Response Updated
   * @param dataResponse
   * @returns
   */
  public static updated<TData>(dataResponse: DataResponseEntity<TData>): DtoHttpResponse<TData> {
    const message = 'data has been updated'

    return this.baseResponse({ message, ...dataResponse })
  }

  /**
   * Response Deleted
   * @param dataResponse
   * @returns
   */
  public static deleted<TData>(dataResponse: DataResponseEntity<TData>): DtoHttpResponse<TData> {
    const message = 'data has been deleted'

    return this.baseResponse({ message, ...dataResponse })
  }
}
