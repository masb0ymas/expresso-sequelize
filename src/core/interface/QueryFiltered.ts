import { type Includeable, type Order, type WhereOptions } from 'sequelize'

export interface FilteredQueryEntity {
  id: string
  value: string
}

export interface SortedQueryEntity {
  sort: string
  order: 'ASC' | 'DESC'
}

export interface DtoQueryEntity {
  include: Includeable | Includeable[]
  includeCount: Includeable | Includeable[]
  where: WhereOptions
  order: Order
  offset: number
  limit: number
}
