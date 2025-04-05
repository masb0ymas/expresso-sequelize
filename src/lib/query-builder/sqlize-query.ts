import { DataTypes, Includeable, IncludeOptions, Model } from 'sequelize'
import { QueryHelper } from './query-helper'
import { TransformHelper } from './transform-helper'

type TValueParser = (value: any) => any
type TTransformBuild = (value: any, transformHelper: TransformHelper) => any
type TQueryBuilder = (value: any, queryHelper: QueryHelper) => any

type TCustomIncludeOptions = IncludeOptions & { key?: string }
type TOnBuildInclude = (value: TCustomIncludeOptions) => TCustomIncludeOptions

/**
 * Get primitive data type based on Sequelize DataType
 * @param dataType - Sequelize DataType
 * @returns Primitive representation as 'string' or 0
 */
export function getPrimitiveDataType<T>(dataType: T): 'string' | 0 {
  const findDataType = (item: any): boolean => dataType instanceof item

  const stringTypes = [
    DataTypes.JSON,
    DataTypes.TEXT,
    DataTypes.STRING,
    DataTypes.UUID,
    DataTypes.UUIDV1,
    DataTypes.UUIDV4,
  ]

  const numberTypes = [
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
  ]

  if (stringTypes.some(findDataType)) {
    return 'string'
  }

  if (numberTypes.some(findDataType)) {
    return 0
  }

  // Default is string for all other types
  return 'string'
}

/**
 * Transform Sequelize includes to queryable format
 * @param includes - Array of Sequelize includeable objects
 * @param onBuildInclude - Optional callback to modify each include
 * @returns Array of custom include options
 */
export function transfromIncludeToQueryable(
  includes: Includeable[],
  onBuildInclude?: TOnBuildInclude
): TCustomIncludeOptions[] {
  const result: TCustomIncludeOptions[] = []
  const _onBuildInclude = onBuildInclude ?? ((value: TCustomIncludeOptions) => value)

  function processIncludes(includes: Includeable[], parent?: IncludeOptions): void {
    for (const include of includes) {
      const customInclude = include as TCustomIncludeOptions
      const { model, key, include: nestedIncludes, ...restInclude } = customInclude

      const isTypeModel = typeof Model === typeof include
      const curModel = (isTypeModel ? include : model) as typeof Model
      const defaultName = curModel.options.name?.singular

      const processedInclude = _onBuildInclude({
        ...(isTypeModel ? {} : restInclude),
        key: key ?? defaultName,
        model: curModel,
      } as unknown as TCustomIncludeOptions)

      if (parent) {
        parent.include = parent.include ?? []
        parent.include.push(processedInclude)
      } else {
        result.push(processedInclude)
      }

      if (nestedIncludes) {
        processIncludes(nestedIncludes, processedInclude)
      }
    }
  }

  processIncludes(includes)
  return result
}

export default class SqlizeQuery {
  private readonly _valueParsers: TValueParser[] = []
  private readonly _transformBuilds: TTransformBuild[] = []
  private readonly _queryBuilders: TQueryBuilder[] = []

  /**
   * Add a value parser function
   */
  public addValueParser(fn: TValueParser): void {
    this._valueParsers.push(fn)
  }

  /**
   * Add a query builder function
   */
  public addQueryBuilder(fn: TQueryBuilder): void {
    this._queryBuilders.push(fn)
  }

  /**
   * Add a transform build function
   */
  public addTransformBuild(fn: TTransformBuild): void {
    this._transformBuilds.push(fn)
  }

  /**
   * Build the query by applying parsers, builders and transforms
   * @param value - Input value to process
   * @returns Processed query result
   */
  public build(value: any): any {
    // Apply all value parsers
    let parsedValue = value
    for (const parser of this._valueParsers) {
      parsedValue = parser(parsedValue)
    }

    // Apply query builders
    const queryHelper = new QueryHelper(Array.isArray(parsedValue) ? parsedValue : [])
    const valueArray = Array.isArray(parsedValue) && parsedValue.length ? parsedValue : [undefined]

    for (const item of valueArray) {
      for (const builder of this._queryBuilders) {
        builder(item, queryHelper)
      }
    }

    // Apply transform builds
    const result = queryHelper.getQuery()
    const transformHelper = new TransformHelper(result)

    for (const transform of this._transformBuilds) {
      transform(result, transformHelper)
    }

    return transformHelper.getValue()
  }
}
