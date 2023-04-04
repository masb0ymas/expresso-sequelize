export class QueryHelper {
  private _valueQuery: any = {}

  private readonly _data: any[]

  constructor(data: any[]) {
    this._data = data
  }

  public getDataValueById(id: any): any {
    return this._data.find((x) => x.id === id)?.value
  }

  public setQuery(id: any, value: any): void {
    // set(this._valueQuery, id, value)
    this._valueQuery[id] = value
  }

  public getQuery(): any {
    return this._valueQuery
  }

  public getQueryById(id: any): any {
    return this._valueQuery[id]
  }

  public deleteQuery(id: any): boolean {
    return delete this._valueQuery[id]
  }
}
