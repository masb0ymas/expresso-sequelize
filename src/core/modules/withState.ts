import { type Request } from 'express'
import _ from 'lodash'
import getterObject from '../utils/getterObject'
import { pickMultiFieldMulter, pickSingleFieldMulter } from './withMulter'

class withState {
  private readonly req: Request

  constructor(req: Request) {
    this.req = req
    this.req.setState = this.setState.bind(this)
    this.req.setBody = this.setBody.bind(this)
    this.req.setFieldState = this.setFieldState.bind(this)
    this.req.getState = this.getState.bind(this)
    this.req.getCookies = this.getCookies.bind(this)
    this.req.getHeaders = this.getHeaders.bind(this)
    this.req.getQuery = this.getQuery.bind(this)
    this.req.getQueryPolluted = this.getQueryPolluted.bind(this)
    this.req.getParams = this.getParams.bind(this)
    this.req.getBody = this.getBody.bind(this)
    this.req.getSingleArrayFile = this.getSingleArrayFile.bind(this)
    this.req.pickSingleFieldMulter = this.pickSingleFieldMulter.bind(this)
    this.req.getMultiArrayFile = this.getMultiArrayFile.bind(this)
    this.req.pickMultiFieldMulter = this.pickMultiFieldMulter.bind(this)
  }

  setState(value: object): void {
    this.req.state = {
      ...(this.req.state || {}),
      ...value,
    }
  }

  setBody(value: object): void {
    this.req.body = {
      ...this.req.body,
      ...value,
    }
  }

  setFieldState(key: any, value: any): void {
    _.set(this.req.state, key, value)
  }

  getState(path: any, defaultValue?: any): any {
    return _.get(this.req.state, path, defaultValue)
  }

  getCookies(path?: any, defaultValue?: any): any {
    return getterObject(this.req.cookies, path, defaultValue)
  }

  getHeaders(path?: any, defaultValue?: any): any {
    return getterObject(this.req.headers, path, defaultValue)
  }

  getQuery(path?: any, defaultValue?: any): any {
    return getterObject(this.req.query, path, defaultValue)
  }

  getQueryPolluted(path?: any, defaultValue?: any): any {
    return getterObject(this.req.queryPolluted, path, defaultValue)
  }

  getParams(path?: any, defaultValue?: any): any {
    return getterObject(this.req.params, path, defaultValue)
  }

  getBody(path?: any, defaultValue?: any): any {
    return getterObject(this.req.body, path, defaultValue)
  }

  getSingleArrayFile(name: string): any {
    const data = getterObject(
      this.req,
      ['files', name, '0'].join('.')
    ) as unknown as Express.Multer.File
    if (data) {
      return data
    }
  }

  pickSingleFieldMulter(fields: string[]): Partial<any> {
    return pickSingleFieldMulter(this.req, fields)
  }

  getMultiArrayFile(name: string): any {
    const data = _.get(
      this.req.files,
      name,
      []
    ) as unknown as Express.Multer.File

    if (data) {
      return data
    }
  }

  pickMultiFieldMulter(fields: string[]): Partial<any> {
    return pickMultiFieldMulter(this.req, fields)
  }
}

export default withState
