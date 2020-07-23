import { isNil, get } from 'lodash'

function getterObject<
  TObject extends object,
  TKey extends keyof TObject,
  TDefault
>(
  object: TObject | null | undefined,
  path?: TKey | [TKey] | string,
  defaultValue?: TDefault
): TObject | null | undefined {
  if (isNil(path) || path === '') {
    return object
  }

  return get(object, path, defaultValue)
}

export default getterObject
