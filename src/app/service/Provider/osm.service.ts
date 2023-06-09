import { type AxiosResponse } from 'axios'
import qs from 'qs'
import FetchAxios from '~/config/axios'
import { env } from '~/config/env'

const FetchApi = new FetchAxios(env.OPEN_STREET_MAP_URL)

export default class OpenStreetMapService {
  private static readonly api = FetchApi.default

  /**
   *
   * @param address
   * @returns
   */
  public static async getByAddress(
    address: string
  ): Promise<AxiosResponse<any, any>> {
    const queryParams = qs.stringify({ format: 'json', limit: 5, q: address })

    const response = await this.api.get(`/search?${queryParams}`)
    const data = response.data

    return data
  }

  /**
   *
   * @param latitude
   * @param longitude
   * @returns
   */
  public static async getByCoordinate(
    latitude: string,
    longitude: string
  ): Promise<AxiosResponse<any, any>> {
    const queryParams = qs.stringify({
      format: 'jsonv2',
      lat: latitude,
      lon: longitude,
    })

    const response = await this.api.get(`/reverse?${queryParams}`)
    const data = response.data

    return data
  }
}
