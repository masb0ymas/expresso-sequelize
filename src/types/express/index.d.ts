import withState from 'helpers/withState'

declare global {
  namespace Express {
    interface Request extends withState {
      state: object
      _transaction: any
      tokenPublicDecoded: any
    }
  }
}
