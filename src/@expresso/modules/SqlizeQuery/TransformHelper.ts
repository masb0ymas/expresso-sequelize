class TransformHelper<T = any> {
  private value: T | undefined

  constructor(initialValue: any) {
    this.setValue(initialValue)
  }

  setValue(value: any) {
    this.value = value
  }

  getValue() {
    return this.value
  }
}

export default TransformHelper
