import { logErrServer } from '@expresso/helpers/Formatter'
import ResponseError from '@expresso/modules/Response/ResponseError'
import RedisProvider from '@expresso/providers/Redis'
import axios, { AxiosError, AxiosInstance } from 'axios'
import chalk from 'chalk'
import _ from 'lodash'
import { LOG_SERVER } from './baseURL'
import { AXIOS_TIMEOUT } from './env'

const Redis = new RedisProvider()

function createAxios(baseUri: string): AxiosInstance {
  const instanceAxios = axios.create({
    baseURL: baseUri,
    timeout: AXIOS_TIMEOUT,
  })

  // interceptor request
  instanceAxios.interceptors.request.use((config) => {
    const curConfig = { ...config }

    // ALWAYS READ UPDATED TOKEN
    const cacheToken = Redis.get('token')

    if (!_.isEmpty(cacheToken)) {
      try {
        // @ts-expect-error
        curConfig.headers.Authorization = cacheToken
      } catch (e) {
        console.log(e)
      }
    }

    return curConfig
  })

  // interceptor response
  instanceAxios.interceptors.response.use(
    function onSuccess(response) {
      return response
    },

    async function onError(error: AxiosError): Promise<never> {
      const statusCode = _.get(error, 'response.status', null)
      const message = _.get(error, 'response.data.message', null)

      const errAxios = (type: string): string => chalk.red(`Axios Err: ${type}`)

      if (statusCode === 401) {
        console.log(logErrServer(errAxios('Unauhtorized'), message))
        throw new ResponseError.Unauthorized(message)
      }

      if (statusCode === 400) {
        console.log(logErrServer(errAxios('Bad Request'), message))
        throw new ResponseError.BadRequest(message)
      }

      if (statusCode === 404) {
        console.log(logErrServer(errAxios('Not Found'), message))
        throw new ResponseError.NotFound(message)
      }

      const handleError = error?.response?.headers?.handleError
      // @ts-expect-error
      if (!handleError || !handleError(error)) {
        if (error.code === 'ECONNREFUSED') {
          console.log(logErrServer(errAxios('Service Unavailable'), message))
          throw new ResponseError.InternalServer('Service Unavailable')
        }

        const errMessage = error.response?.data ?? error.message

        console.log(`${LOG_SERVER} ${errAxios(errMessage)}`)
        throw new ResponseError.BadRequest(errMessage)
      }
      return await Promise.reject(error)
    }
  )

  return instanceAxios
}

class FetchApi {
  private axiosInstance: AxiosInstance | null
  private readonly baseUri: string

  constructor(baseUri: string) {
    this.axiosInstance = null
    this.baseUri = baseUri
  }

  public get default(): AxiosInstance {
    if (!this.axiosInstance) {
      this.axiosInstance = createAxios(this.baseUri)

      return this.axiosInstance
    }

    return this.axiosInstance
  }
}

export default FetchApi
