export class TransformHelper<T = any> {
  private value: T | undefined

  constructor(initialValue: T) {
    this.setValue(initialValue)
  }

  /**
   * Sets the internal value
   * @param value - The value to store
   */
  public setValue(value: T): void {
    this.value = value
  }

  /**
   * Retrieves the stored value
   * @returns The current value
   */
  public getValue(): T | undefined {
    return this.value
  }

  /**
   * Applies a transformation function to the current value
   * @param transformFn - Function to transform the current value
   * @returns This instance for chaining
   */
  public transform(transformFn: (value: T | undefined) => T): this {
    this.value = transformFn(this.value)
    return this
  }
}
