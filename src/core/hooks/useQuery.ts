import {
  type DtoQueryEntity,
  type useQueryEntity,
} from '@core/interface/QueryFiltered'
import _ from 'lodash'
import { type Includeable } from 'sequelize'
import {
  filterIncludeHandledOnly,
  getFilteredQuery,
  getPaginationQuery,
  getSortedQuery,
  injectRequireInclude,
} from './Query/PluginSqlizeQuery'

export default function useQuery(params: useQueryEntity): DtoQueryEntity {
  const { entity, reqQuery, includeRule, options } = params

  const { onBeforeBuild } = options ?? {}

  const paginationQuery = getPaginationQuery()
  const filteredQuery = getFilteredQuery(entity)
  const sortedQuery = getSortedQuery()
  const includeCountRule = filterIncludeHandledOnly({
    include: includeRule,
  })

  const include = injectRequireInclude(
    _.cloneDeep(includeRule) as Includeable[]
  )

  const includeCount = injectRequireInclude(
    _.cloneDeep(includeCountRule) as Includeable[]
  )

  if (onBeforeBuild) {
    onBeforeBuild({
      filteredQuery,
      paginationQuery,
      sortedQuery,
    })
  }

  const pagination = paginationQuery.build(reqQuery)
  const filter = filteredQuery.build(reqQuery.filtered)
  const sort = sortedQuery.build(reqQuery.sorted)

  return {
    include,
    includeCount,
    where: filter,
    order: sort,
    offset: pagination.offset,
    limit: pagination.limit,
  }
}
