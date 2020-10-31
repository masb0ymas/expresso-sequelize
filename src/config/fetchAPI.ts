/* eslint-disable no-unused-vars */
import axios, { AxiosInstance } from 'axios'

class fetchAPI {
  private axiosDefault: AxiosInstance

  private baseUri: string

  constructor(baseUri: string) {
    // @ts-ignore
    this.axiosDefault = null
    this.baseUri = baseUri
  }

  get default(): AxiosInstance {
    if (!this.axiosDefault) {
      this.axiosDefault = axios.create({
        baseURL: this.baseUri,
      })
      return this.axiosDefault
    }

    return this.axiosDefault
  }
}

export default fetchAPI
