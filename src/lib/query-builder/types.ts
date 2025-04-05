import {
  ConnectionOptions,
  Includeable,
  IncludeOptions,
  ModelStatic,
  ModelType,
  Order,
  WhereOptions,
} from 'sequelize'
import SqlizeQuery from './sqlize-query'

export type SequelizeOnBeforeBuildQuery = {
  paginationQuery: SqlizeQuery
  filteredQuery: SqlizeQuery
  sortedQuery: SqlizeQuery
}

export type SequelizeQueryOptions = {
  onBeforeBuild: (query: SequelizeOnBeforeBuildQuery) => void
}

export type SequelizeConnectionOptions = ConnectionOptions & {
  dialect?: string
}

export type SequelizeGetFilteredQuery = {
  model?: ModelStatic<any>
  prefixName?: string
  options?: SequelizeConnectionOptions
}

export type SequelizeIncludeFilteredQuery = {
  filteredValue: any
  model: ModelType<any, any> | undefined
  prefixName: string | undefined
  options?: IncludeOptions
}

export type SequelizeFilterIncludeHandledOnly = {
  include: any
  filteredInclude?: any
}

export type UseQuerySequelize = {
  model: ModelStatic<any>
  reqQuery: RequestQuery
  includeRule?: Includeable | Includeable[]
  limit?: number
  options?: SequelizeQueryOptions
}

export type DtoSequelizeQuery = {
  include: Includeable | Includeable[]
  includeCount: Includeable | Includeable[]
  where: WhereOptions
  order: Order
  offset: number
  limit: number
}

export type QueryFilters = {
  id: string
  value: string
}

export type QuerySorts = {
  sort: string
  order: 'ASC' | 'DESC'
}

type RequestQuery = {
  filtered?: QueryFilters[]
  sorted?: QuerySorts[]
  page?: string | number
  pageSize?: string | number
  [key: string]: any
}
