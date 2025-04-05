export class QueryHelper {
  private _valueQuery: Record<string, any> = {}
  private readonly _data: any[]

  /**
   * Creates an instance of QueryHelper.
   * @param data - The data array to be used for lookup operations.
   */
  constructor(data: any[]) {
    this._data = data
  }

  /**
   * Retrieves the value of an item from the data array by its id.
   * @param id - The id of the item to find.
   * @returns The value of the found item or undefined if not found.
   */
  public getDataValueById(id: string): any {
    return this._data.find((item) => item.id === id)?.value
  }

  /**
   * Sets a query value for a specific id.
   * @param id - The id to associate with the value.
   * @param value - The value to store.
   */
  public setQuery(id: string, value: any): void {
    this._valueQuery[id] = value
  }

  /**
   * Gets all query values.
   * @returns The complete query object.
   */
  public getQuery(): Record<string, any> {
    return this._valueQuery
  }

  /**
   * Gets a query value by its id.
   * @param id - The id of the query to retrieve.
   * @returns The value associated with the id.
   */
  public getQueryById(id: string): any {
    return this._valueQuery[id]
  }

  /**
   * Deletes a query value by its id.
   * @param id - The id of the query to delete.
   * @returns True if the deletion was successful.
   */
  public deleteQuery(id: string): boolean {
    return delete this._valueQuery[id]
  }
}
