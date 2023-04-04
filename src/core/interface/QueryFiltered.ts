import type SqlizeQuery from '@core/hooks/Query/SqlizeQuery'
import {
  type IncludeOptions,
  type Includeable,
  type ModelStatic,
  type Order,
  type WhereOptions,
} from 'sequelize'

export interface FilteredQueryEntity {
  id: string
  value: string
}

export interface SortedQueryEntity {
  sort: string
  order: 'ASC' | 'DESC'
}

export interface FilterIncludeHandledOnlyEntity {
  include: any
  filteredInclude?: any
}

export interface IncludeFilteredQueryEntity {
  filteredValue: any
  model: any
  prefixName: any
  options?: IncludeOptions
}

export interface ReqGenerate {
  filtered?: FilteredQueryEntity[]
  sorted?: SortedQueryEntity[]
  page?: number
  pageSize?: number
  [key: string]: any
}

export interface OnBeforeBuildQuery {
  paginationQuery: SqlizeQuery
  filteredQuery: SqlizeQuery
  sortedQuery: SqlizeQuery
}

export interface QueryOptions {
  onBeforeBuild: (query: OnBeforeBuildQuery) => void
}

export interface useQueryEntity {
  entity: ModelStatic<any>
  reqQuery: ReqGenerate
  includeRule?: Includeable | Includeable[]
  options?: QueryOptions
}

export interface DtoQueryEntity {
  include: Includeable | Includeable[]
  includeCount: Includeable | Includeable[]
  where: WhereOptions
  order: Order
  offset: number
  limit: number
}
