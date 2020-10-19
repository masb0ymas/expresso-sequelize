/* eslint-disable no-unused-vars */
import SqlizeQuery from 'modules/SqlizeQuery/index'
import {
  getPrimitiveDataType,
  transfromIncludeToQueryable,
} from 'modules/SqlizeQuery/SqlizeQuery'
import { Op, ModelCtor, Includeable, IncludeOptions } from 'sequelize'
import { cloneDeep, unset } from 'lodash'

const parserString = (value: any) => {
  return typeof value === 'string' ? JSON.parse(value) : value || []
}

function getExactQueryIdModel(id: string, prefixName: any) {
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
    ? splitId
        .filter((str, index) => {
          return [indexId, indexId + 1].includes(index)
        })
        .pop()
    : id

  if (!curId || (prefixName && splitId.indexOf(curId) !== splitId.length - 1)) {
    return undefined
  }

  return curId
}

function getFilteredQuery(model?: ModelCtor<any>, prefixName?: string) {
  const sequelizeQuery = new SqlizeQuery()
  sequelizeQuery.addValueParser(parserString)
  sequelizeQuery.addQueryBuilder(
    (filterData: { id: string; value: any }, queryHelper) => {
      const { id, value } = filterData || {}
      const curId = getExactQueryIdModel(id, prefixName)
      if (!curId) {
        return
      }

      const type = typeof getPrimitiveDataType(
        model?.rawAttributes?.[curId]?.type
      )

      if (type === 'number') {
        queryHelper.setQuery(
          curId,
          curId.endsWith('Id')
            ? value
            : {
                [Op.like]: `%${value}%`,
              }
        )
      } else {
        queryHelper.setQuery(curId, {
          [Op.like]: `%${value}%`,
        })
      }
    }
  )
  return sequelizeQuery
}

function getSortedQuery() {
  const sequelizeQuery = new SqlizeQuery()
  sequelizeQuery.addValueParser(parserString)
  sequelizeQuery.addQueryBuilder((value, queryHelper) => {
    if (value?.id) {
      queryHelper.setQuery(value.id, value.desc === true ? 'DESC' : 'ASC')
    }
  })
  sequelizeQuery.addTransformBuild((buildValue, transformHelper) => {
    transformHelper.setValue(
      Object.entries(buildValue).map(([id, value]) => {
        return [...id.split('.'), value]
      })
    )
  })
  return sequelizeQuery
}

function getPaginationQuery() {
  const sequelizeQuery = new SqlizeQuery()
  const offsetId = 'page'
  const limitId = 'pageSize'
  const defaultOffset = 0
  const defaultLimit = 10
  sequelizeQuery.addValueParser((value) => {
    return [
      {
        id: offsetId,
        value: Number(value.page),
      },
      {
        id: limitId,
        value: Number(value.pageSize),
      },
    ]
  })

  sequelizeQuery.addQueryBuilder(({ id, value }, queryHelper) => {
    if (id === offsetId) {
      const offsetValue = queryHelper.getDataValueById(limitId) * (value - 1)
      queryHelper.setQuery(
        'offset',
        offsetValue > 0 ? offsetValue : defaultOffset
      )
    }
    if (id === limitId) {
      queryHelper.setQuery('limit', value || defaultLimit)
    }
  })

  return sequelizeQuery
}

function getIncludeFilteredQuery(
  filteredValue: any,
  model: any,
  prefixName: any,
  options?: IncludeOptions
) {
  const where = getFilteredQuery(model, prefixName).build(filteredValue)

  let extraProps = {}

  if (Object.keys(where).length > 0) {
    extraProps = {
      ...extraProps,
      where,
      required: true,
    }
  }

  return {
    model,
    ...extraProps,
    ...options,
  }
}

function filterIncludeHandledOnly({
  include,
  filteredInclude,
}: {
  include: any
  filteredInclude?: any
}) {
  const curFilteredInclude = filteredInclude || []
  if (include) {
    for (let i = 0; i < include.length; i += 1) {
      const curModel = include[i]
      let childIncludes = []
      if (curModel.include) {
        childIncludes = filterIncludeHandledOnly({
          include: curModel.include,
        })
      }

      if (curModel.where || curModel.required || childIncludes.length > 0) {
        const clonedInclude = cloneDeep(curModel)
        unset(clonedInclude, 'include')
        if (childIncludes.length > 0) {
          clonedInclude.include = [...childIncludes]
        }
        curFilteredInclude.push(clonedInclude)
      }
    }
  }
  return curFilteredInclude
}

function injectRequireInclude(include: Includeable[]) {
  function test(dataInclude: Includeable[]) {
    for (let i = 0; i < (dataInclude?.length || 0); i += 1) {
      const optionInclude = dataInclude[i] as IncludeOptions
      let data
      if (optionInclude.include) {
        data = test(optionInclude.include)
      }

      if (optionInclude.required) return true
      if (data && optionInclude.required === undefined) {
        optionInclude.required = true
        return true
      }
    }
    return false
  }

  test(include)

  return include
}

function makeIncludeQueryable(filteredValue: any, includes: Includeable[]) {
  return transfromIncludeToQueryable(includes, (value) => {
    const { model, key, ...restValue } = value
    return getIncludeFilteredQuery(filteredValue, model, value.key, {
      key,
      ...restValue,
    } as IncludeOptions)
  })
}

interface OnBeforeBuildQuery {
  paginationQuery: SqlizeQuery
  filteredQuery: SqlizeQuery
  sortedQuery: SqlizeQuery
}

interface GenerateOptions {
  onBeforeBuild: (query: OnBeforeBuildQuery) => void
}

interface ReqGenerate {
  query:
    | {
        filtered?: { id: any; value: any }[]
        sorted?: { id: any; desc: boolean }[]
        page?: number
        pageSize?: number
      }
    | any
}

function generate(
  req: ReqGenerate,
  model: any,
  includeRule?: Includeable | Includeable[],
  options?: GenerateOptions
) {
  const { onBeforeBuild } = options || {}

  const paginationQuery = getPaginationQuery()
  const filteredQuery = getFilteredQuery(model)
  const sortedQuery = getSortedQuery()
  const includeCountRule = filterIncludeHandledOnly({
    include: includeRule,
  })
  const include = injectRequireInclude(cloneDeep(includeRule) as Includeable[])
  const includeCount = injectRequireInclude(
    cloneDeep(includeCountRule) as Includeable[]
  )

  if (onBeforeBuild) {
    onBeforeBuild({
      filteredQuery,
      paginationQuery,
      sortedQuery,
    })
  }

  const pagination = paginationQuery.build(req.query)
  const filter = filteredQuery.build(req.query.filtered)
  const sort = sortedQuery.build(req.query.sorted)

  return {
    include,
    includeCount,
    where: filter,
    order: sort as any,
    offset: pagination.offset,
    limit: pagination.limit,
  }
}

const PluginSqlizeQuery = {
  generate,
  makeIncludeQueryable,
}

export default PluginSqlizeQuery
