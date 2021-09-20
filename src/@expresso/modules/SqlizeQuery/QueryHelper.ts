/* eslint-disable @typescript-eslint/no-dynamic-delete */
class QueryHelper {
  private valueQuery: any = {}

  private readonly data: any[]

  constructor(data: any[]) {
    this.data = data
  }

  getDataValueById(id: any): any {
    return this.data.find((x) => x.id === id)?.value
  }

  setQuery(id: any, value: any): void {
    // set(this.valueQuery, id, value)
    this.valueQuery[id] = value
  }

  getQuery(): any {
    return this.valueQuery
  }

  getQueryById(id: any): any {
    return this.valueQuery[id]
  }

  deleteQuery(id: any): boolean {
    return delete this.valueQuery[id]
  }
}

export default QueryHelper
