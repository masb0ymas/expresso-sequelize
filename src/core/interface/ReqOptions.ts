import { type Includeable, type Order, type Transaction } from 'sequelize'

export interface IReqOptions {
  lang?: string
  include?: Includeable | Includeable[]
  order?: Order
  paranoid?: boolean
  force?: boolean
  transaction?: Transaction
}
