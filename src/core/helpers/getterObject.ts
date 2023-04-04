import _ from 'lodash'

function getterObject<
  TObject extends object,
  TKey extends keyof TObject,
  TDefault
>(
  object: TObject | null | undefined,
  path?: TKey | [TKey] | string,
  defaultValue?: TDefault
): TObject | null | undefined {
  if (_.isNil(path) || path === '') {
    return object
  }

  return _.get(object, path, defaultValue)
}

export default getterObject
