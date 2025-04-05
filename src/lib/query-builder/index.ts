import _ from 'lodash'
import { Includeable, IncludeOptions, ModelStatic, Op } from 'sequelize'
import { validate as uuidValidate } from 'uuid'
import { env } from '~/config/env'
import SqlizeQuery, { getPrimitiveDataType, transfromIncludeToQueryable } from './sqlize-query'
import {
  DtoSequelizeQuery,
  SequelizeConnectionOptions,
  SequelizeFilterIncludeHandledOnly,
  SequelizeGetFilteredQuery,
  SequelizeIncludeFilteredQuery,
  UseQuerySequelize,
} from './types'

/**
 * Parses a string value to JSON or returns the original value
 * @param value - The value to parse
 * @returns Parsed JSON object or original value
 */
function parserString(value: any): any {
  return typeof value === 'string' ? JSON.parse(value) : value || []
}

/**
 * Extracts the exact query ID for a model based on prefix
 * @param id - The full ID string to process
 * @param prefixName - Optional prefix to filter by
 * @returns The extracted query ID or undefined if invalid
 */
function getExactQueryIdModel(id: string, prefixName?: string): string | undefined {
  if (id === undefined) {
    return undefined
  }

  const splitId = id.split('.')
  if (!prefixName && splitId.length > 1) {
    return undefined
  }

  const indexId = splitId.findIndex((str) => str === prefixName)
  if (prefixName && indexId < 0) {
    return undefined
  }

  const curId = prefixName
    ? splitId.filter((str, index) => index === indexId || index === indexId + 1).pop()
    : id

  if (!curId || (prefixName && splitId.indexOf(curId) !== splitId.length - 1)) {
    return undefined
  }

  return curId
}

/**
 * Creates a query builder for filtering data
 * @param params - Parameters for filtered query
 * @returns Configured SqlizeQuery instance
 */
function getFilteredQuery(params: SequelizeGetFilteredQuery): SqlizeQuery {
  const { model, prefixName, options } = params

  const sequelizeQuery = new SqlizeQuery()
  sequelizeQuery.addValueParser(parserString)

  sequelizeQuery.addQueryBuilder((filterData: { id: string; value: any }, queryHelper) => {
    const { id, value } = filterData || {}
    if (!id || value === undefined || value === null) return

    const curId = getExactQueryIdModel(id, prefixName)
    if (!curId) return

    const type = typeof getPrimitiveDataType(model?.rawAttributes?.[curId]?.type)

    if (type !== 'number') {
      if (uuidValidate(value)) {
        queryHelper.setQuery(curId, { [Op.eq]: value })
      } else if (options?.dialect === 'postgres') {
        queryHelper.setQuery(curId, { [Op.iLike]: `%${value}%` })
      } else {
        queryHelper.setQuery(curId, { [Op.like]: `%${value}%` })
      }
    } else {
      queryHelper.setQuery(curId, curId.endsWith('Id') ? value : { [Op.like]: `%${value}%` })
    }
  })

  return sequelizeQuery
}

/**
 * Creates a query builder for sorting data
 * @returns Configured SqlizeQuery instance for sorting
 */
function getSortedQuery(): SqlizeQuery {
  const sequelizeQuery = new SqlizeQuery()
  sequelizeQuery.addValueParser(parserString)

  sequelizeQuery.addQueryBuilder((value, queryHelper) => {
    if (value?.sort) {
      queryHelper.setQuery(value.sort, value.order)
    }
  })

  sequelizeQuery.addTransformBuild((buildValue, transformHelper) => {
    transformHelper.setValue(
      Object.entries(buildValue).map(([id, value]) => [...id.split('.'), value])
    )
  })

  return sequelizeQuery
}

/**
 * Creates a query builder for pagination
 * @param limit - Optional maximum limit
 * @returns Configured SqlizeQuery instance for pagination
 */
function getPaginationQuery(limit = 1000): SqlizeQuery {
  const sequelizeQuery = new SqlizeQuery()
  const offsetId = 'page'
  const limitId = 'pageSize'
  const defaultOffset = 0
  const minLimit = 10

  sequelizeQuery.addValueParser((value) => {
    const pageSize = Math.min(Math.max(Number(value.pageSize) || minLimit, minLimit), limit)

    return [
      { id: offsetId, value: Number(value.page) },
      { id: limitId, value: pageSize },
    ]
  })

  sequelizeQuery.addQueryBuilder(({ id, value }, queryHelper) => {
    if (id === offsetId) {
      const offsetValue = queryHelper.getDataValueById(limitId) * (value - 1)
      queryHelper.setQuery('offset', offsetValue > 0 ? offsetValue : defaultOffset)
    }
    if (id === limitId) {
      queryHelper.setQuery('limit', value || minLimit)
    }
  })

  return sequelizeQuery
}

/**
 * Builds an include query with filtering
 * @param params - Parameters for include filtering
 * @returns Configured include object
 */
function getIncludeFilteredQuery(params: SequelizeIncludeFilteredQuery): any {
  const { filteredValue, model, prefixName, options } = params
  const where = getFilteredQuery({ model: model as ModelStatic<any>, prefixName }).build(
    filteredValue
  )

  if (Object.keys(where).length === 0) {
    return { model, ...options }
  }

  return {
    model,
    where,
    required: true,
    ...options,
  }
}

/**
 * Filters includes to only return those with conditions
 * @param params - Parameters containing includes to filter
 * @returns Filtered includes array
 */
function filterIncludeHandledOnly(params: SequelizeFilterIncludeHandledOnly): any[] {
  const { include, filteredInclude = [] } = params

  if (!include) return filteredInclude

  for (const curModel of include) {
    let childIncludes = []

    if (curModel.include) {
      childIncludes = filterIncludeHandledOnly({
        include: curModel.include,
      })
    }

    if (curModel.where || curModel.required || childIncludes.length > 0) {
      const clonedInclude = _.cloneDeep(curModel)
      _.unset(clonedInclude, 'include')

      if (childIncludes.length > 0) {
        clonedInclude.include = childIncludes
      }

      filteredInclude.push(clonedInclude)
    }
  }

  return filteredInclude
}

/**
 * Recursively injects required flag based on child includes
 * @param include - Array of includes to process
 * @returns Processed includes with required flags
 */
function injectRequireInclude(include: Includeable[]): Includeable[] {
  function processIncludes(dataInclude: Includeable[]): boolean {
    if (!dataInclude?.length) return false

    let hasRequired = false

    for (const item of dataInclude) {
      const optionInclude = item as IncludeOptions

      if (optionInclude.required) {
        hasRequired = true
        continue
      }

      if (optionInclude.include && processIncludes(optionInclude.include)) {
        optionInclude.required = true
        hasRequired = true
      }
    }

    return hasRequired
  }

  processIncludes(include)
  return include
}

/**
 * Transforms includes into queryable format with filtering
 * @param filteredValue - Values to filter by
 * @param includes - Includes to transform
 * @returns Queryable includes
 */
export function makeIncludeQueryable(filteredValue: any, includes: Includeable[]): any {
  return transfromIncludeToQueryable(includes, (value) => {
    const { model, key, ...restValue } = value
    return getIncludeFilteredQuery({
      filteredValue,
      model,
      prefixName: value.key,
      options: { key, ...restValue } as IncludeOptions,
    })
  })
}

/**
 * Builds a query object for Sequelize
 * @param params - Query parameters
 * @param options - Sequelize connection options
 * @returns Query object with include, includeCount, where, order, offset, and limit
 */
function QueryBuilder(
  params: UseQuerySequelize,
  options?: SequelizeConnectionOptions
): DtoSequelizeQuery {
  const { model, reqQuery, includeRule, limit } = params
  const { onBeforeBuild } = params.options ?? {}

  const paginationQuery = getPaginationQuery(limit)
  const filteredQuery = getFilteredQuery({ model, options })
  const sortedQuery = getSortedQuery()

  const includeCountRule = filterIncludeHandledOnly({ include: includeRule })
  const include = injectRequireInclude(_.cloneDeep(includeRule) as Includeable[])
  const includeCount = injectRequireInclude(_.cloneDeep(includeCountRule) as Includeable[])

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

/**
 * Builds a query object for Sequelize
 * @param params - Query parameters
 * @returns Query object with include, includeCount, where, order, offset, and limit
 */
export function useQuery(params: UseQuerySequelize) {
  const dialect = env.SEQUELIZE_CONNECTION
  return QueryBuilder(params, { dialect })
}
