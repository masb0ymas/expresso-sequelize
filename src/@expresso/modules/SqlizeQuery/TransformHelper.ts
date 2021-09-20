class TransformHelper<T = any> {
  private value: T | undefined

  constructor(initialValue: any) {
    this.setValue(initialValue)
  }

  setValue(value: any): void {
    this.value = value
  }

  getValue(): T | undefined {
    return this.value
  }
}

export default TransformHelper
