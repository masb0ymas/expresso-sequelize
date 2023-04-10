import ResponseError from '@core/modules/response/ResponseError'
import axios, { type AxiosError, type AxiosInstance } from 'axios'
import chalk from 'chalk'
import { ms, printLog } from 'expresso-core'
import _ from 'lodash'
import { AXIOS_TIMEOUT } from './env'
import { redisService } from './redis'

const timeout = ms(AXIOS_TIMEOUT)

/**
 * Create Axios Instance
 * @param baseURL
 * @returns
 */
function createAxios(baseURL: string): AxiosInstance {
  const axiosInstance = axios.create({ baseURL, timeout })

  // Interceptiors Request
  axiosInstance.interceptors.request.use(async (config) => {
    const currentConfig = { ...config }

    const storeToken = await redisService.get<string>('token')

    if (storeToken) {
      currentConfig.headers.Authorization = storeToken
    }

    return currentConfig
  })

  // Interceptors Response
  axiosInstance.interceptors.response.use(
    function onSuccess(response) {
      return response
    },

    async function onError(error: AxiosError) {
      const statusCode = _.get(error, 'response.status', null)
      const message = _.get(error, 'response.data.message', null)

      const errAxios = (type: string): string => chalk.red(`Axios Err: ${type}`)

      if (statusCode === 401) {
        const errType = errAxios('Unauhtorized')
        const logMessage = printLog(errType, `${message}`, { label: 'error' })
        console.log(logMessage)

        throw new ResponseError.Unauthorized(`${message}`)
      }

      if (statusCode === 400) {
        const errType = errAxios('Bad Request')
        const logMessage = printLog(errType, `${message}`, { label: 'error' })
        console.log(logMessage)

        throw new ResponseError.BadRequest(`${message}`)
      }

      if (statusCode === 404) {
        const errType = errAxios('Not Found')
        const logMessage = printLog(errType, `${message}`, { label: 'error' })
        console.log(logMessage)

        throw new ResponseError.NotFound(`${message}`)
      }

      const handleError = error?.response?.headers?.handleError

      if (!handleError) {
        if (error.code === 'ECONNREFUSED') {
          const errType = errAxios('Service Unavailable')
          const logMessage = printLog(errType, `${message}`, { label: 'error' })
          console.log(logMessage)

          throw new ResponseError.InternalServer('Service Unavailable')
        }

        const errMessage: any = error.response?.data ?? error.message
        console.log(errAxios(errMessage))

        throw new ResponseError.BadRequest(errMessage)
      }

      return await Promise.reject(error)
    }
  )

  return axiosInstance
}

class FetchAxios {
  private _axiosInstance: AxiosInstance | null
  private readonly _baseURL: string

  constructor(baseURL: string) {
    this._baseURL = baseURL
    this._axiosInstance = null
  }

  /**
   * Default Config Axios
   */
  public get default(): AxiosInstance {
    if (!this._axiosInstance) {
      this._axiosInstance = createAxios(this._baseURL)

      return this._axiosInstance
    }

    return this._axiosInstance
  }
}

export default FetchAxios
