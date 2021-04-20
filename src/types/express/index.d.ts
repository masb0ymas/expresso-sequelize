/* eslint-disable no-unused-vars */
import withState from '@expresso/helpers/withState'
import multer from 'multer'

declare global {
  namespace Express {
    // interface Mutler {
    //   File: any
    // }
    interface Request extends withState {
      state: object
      _transaction: any
      tokenPublicDecoded: any
    }
  }
}
