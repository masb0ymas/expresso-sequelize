import SqlizeQuery from './SqlizeQuery'

export interface FilterIncludeHandledOnlyProps {
  include: any
  filteredInclude?: any
}

export interface ReqGenerate {
  filtered?: Array<{ id: any; value: any }>
  sorted?: Array<{ id: any; desc: boolean }>
  page?: number
  pageSize?: number
  [key: string]: any
}

export interface OnBeforeBuildQuery {
  paginationQuery: SqlizeQuery
  filteredQuery: SqlizeQuery
  sortedQuery: SqlizeQuery
}

export interface DtoFindAll {
  message: string
  total: number
}

export interface GenerateOptions {
  onBeforeBuild: (query: OnBeforeBuildQuery) => void
}
