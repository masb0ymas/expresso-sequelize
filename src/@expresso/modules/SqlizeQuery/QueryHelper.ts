class QueryHelper {
  private valueQuery: any = {}

  private data: any[]

  constructor(data: any[]) {
    this.data = data
  }

  getDataValueById(id: any) {
    return this.data.find((x) => x.id === id)?.value
  }

  setQuery(id: any, value: any) {
    // set(this.valueQuery, id, value)
    this.valueQuery[id] = value
  }

  getQuery() {
    return this.valueQuery
  }

  getQueryById(id: any) {
    return this.valueQuery[id]
  }

  deleteQuery(id: any) {
    return delete this.valueQuery[id]
  }
}

export default QueryHelper
