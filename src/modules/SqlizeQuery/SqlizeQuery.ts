/* eslint-disable no-unused-vars */
import { DataTypes, Includeable, IncludeOptions, Model } from 'sequelize'
import QueryHelper from 'modules/SqlizeQuery/QueryHelper'
import TransformHelper from 'modules/SqlizeQuery/TransformHelper'

type ValueParsers = (value: any) => any
type TransformBuild = (value: any, transformHelper: TransformHelper) => any
type QueryBuilders = (value: any, queryHelper: QueryHelper) => any

export function getPrimitiveDataType<T>(dataType: T) {
  const findDataType = (item: any) => dataType instanceof item

  if (
    [
      DataTypes.JSON,
      DataTypes.TEXT,
      DataTypes.STRING,
      DataTypes.UUID,
      DataTypes.UUIDV1,
      DataTypes.UUIDV4,
    ].find(findDataType)
  ) {
    return 'string'
  }

  if (
    [
      DataTypes.REAL,
      DataTypes.INTEGER,
      DataTypes.FLOAT,
      DataTypes.BIGINT,
      DataTypes.DECIMAL,
      DataTypes.DOUBLE,
      DataTypes.MEDIUMINT,
      DataTypes.NUMBER,
      DataTypes.SMALLINT,
      DataTypes.TINYINT,
    ].find(findDataType)
  ) {
    return 0
  }

  // DataTypes.STRING
  // DataTypes.CHAR
  // DataTypes.TEXT
  // DataTypes.NUMBER
  // DataTypes.TINYINT
  // DataTypes.SMALLINT
  // DataTypes.MEDIUMINT
  // DataTypes.INTEGER
  // DataTypes.BIGINT
  // DataTypes.FLOAT
  // DataTypes.REAL
  // DataTypes.DOUBLE
  // DataTypes.DECIMAL
  // DataTypes.BOOLEAN
  // DataTypes.TIME
  // DataTypes.DATE
  // DataTypes.DATEONLY
  // DataTypes.HSTORE
  // DataTypes.JSON
  // DataTypes.JSONB
  // DataTypes.NOW
  // DataTypes.BLOB
  // DataTypes.RANGE
  // DataTypes.UUID
  // DataTypes.UUIDV1
  // DataTypes.UUIDV4
  // DataTypes.VIRTUAL
  // DataTypes.ENUM
  // DataTypes.ARRAY
  // DataTypes.GEOMETRY
  // DataTypes.GEOGRAPHY
  // DataTypes.CIDR
  // DataTypes.INET
  // DataTypes.MACADDR
  // DataTypes.CITEXT
  // if([
  //   DataTypes.NUMBER
  // ])

  // default is string
  return 'string'
}

class SqlizeQuery {
  private valueParsers: ValueParsers[] = []

  private transformBuilds: TransformBuild[] = []

  private queryBuilders: QueryBuilders[] = []

  addValueParser(fn: ValueParsers) {
    this.valueParsers.push(fn)
  }

  addQueryBuilder(fn: QueryBuilders) {
    this.queryBuilders.push(fn)
  }

  addTransformBuild(fn: TransformBuild) {
    this.transformBuilds.push(fn)
  }

  build(value: any) {
    let parserValue = value as any[]
    for (let i = 0; i < this.valueParsers.length; i += 1) {
      const getterValue = this.valueParsers[i]
      parserValue = getterValue(value)
    }

    const queryHelper = new QueryHelper(parserValue)
    // executed queryBuilder min 1, when parserValue no data
    for (let i = 0; i < (parserValue.length || 1); i += 1) {
      const valueP = parserValue[i]
      for (let k = 0; k < this.queryBuilders.length; k += 1) {
        const queryBuilder = this.queryBuilders[k]
        queryBuilder(valueP, queryHelper)
      }
    }

    const result = queryHelper.getQuery()
    const transformHelper = new TransformHelper(result)
    for (let i = 0; i < this.transformBuilds.length; i += 1) {
      const transformBuild = this.transformBuilds[i]
      transformBuild(result, transformHelper)
    }

    return transformHelper.getValue()
  }
}

type CustomIncludeOptions = IncludeOptions & { key?: string }
type onBuildInclude = (value: CustomIncludeOptions) => CustomIncludeOptions

export function transfromIncludeToQueryable(
  includes: Includeable[],
  onBuildInclude?: onBuildInclude
) {
  const result = [] as CustomIncludeOptions[]
  const _onBuildInclude =
    onBuildInclude ||
    function (value: CustomIncludeOptions) {
      return value
    }
  function wrapFiltered(includes: Includeable[], parent?: IncludeOptions) {
    for (let i = 0; i < includes.length; i += 1) {
      const include = includes[i] as CustomIncludeOptions

      const { model, key, include: oriInclude, ...restInclude } = include

      // TODO: fix compare isTypeModel for better check typing
      const isTypeModel = typeof Model === typeof include
      const curModel = (isTypeModel ? include : model) as typeof Model
      const defaultName = curModel.options.name?.singular
      const data = _onBuildInclude({
        ...(isTypeModel ? {} : restInclude),
        key: key || defaultName,
        model: curModel,
      } as IncludeOptions)

      if (parent) {
        // eslint-disable-next-line no-param-reassign
        parent.include = parent.include || []
        parent.include.push(data)
      } else {
        result.push(data)
      }

      if (include.include) {
        wrapFiltered(include.include, data)
      }
    }
  }
  wrapFiltered(includes)
  return result
}

export default SqlizeQuery
