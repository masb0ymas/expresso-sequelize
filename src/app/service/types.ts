import { Model, ModelStatic } from 'sequelize'
import { z } from 'zod'

export type BaseServiceParams<T extends Model> = {
  repository: ModelStatic<T>
  schema: z.ZodType<any>
  model: string
}

export type FindParams = {
  page: number
  pageSize: number
  filtered: any
  sorted: any
}

export type DtoFindAll<T extends Model> = {
  data: T[]
  total: number
}
