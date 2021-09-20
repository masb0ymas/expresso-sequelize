import ResponseError from '@expresso/modules/Response/ResponseError'
import RedisProvider from '@expresso/providers/Redis'
import axios, { AxiosError, AxiosInstance } from 'axios'
import chalk from 'chalk'
import dotenv from 'dotenv'
import _ from 'lodash'

dotenv.config()

const Redis = new RedisProvider()

const AXIOS_TIMEOUT = Number(process.env.AXIOS_TIMEOUT) ?? 5000

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
        console.log(`${errAxios('Unauhtorized')}, ${message}`)
        throw new ResponseError.Unauthorized(message)
      }

      if (statusCode === 400) {
        console.log(`${errAxios('Bad Request')}, ${message}`)
        throw new ResponseError.BadRequest(message)
      }

      if (statusCode === 404) {
        console.log(`${errAxios('Not Found')}, ${message}`)
        throw new ResponseError.NotFound(message)
      }

      const handleError = error?.response?.headers?.handleError
      if (!handleError || !handleError(error)) {
        if (error.code === 'ECONNREFUSED') {
          console.log(`${errAxios('Service Unavailable')}, ${message}`)
          throw new ResponseError.InternalServer('Service Unavailable')
        }

        console.log(`${errAxios(error.message)}`)
        throw new ResponseError.BadRequest(error.message)
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
