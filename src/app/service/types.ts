import { z } from "zod"
import { ObjectLiteral, Repository } from "typeorm"

export type BaseServiceParams<T extends ObjectLiteral> = {
  repository: Repository<T>
  schema: z.ZodType<any>
  model: string
}

export type FindParams = {
  page: number
  pageSize: number
  filtered: any
  sorted: any
}

export type DtoFindAll<T extends ObjectLiteral> = {
  data: T[]
  total: number
}
