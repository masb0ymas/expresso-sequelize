import { useSequelize } from 'expresso-query'
import {
  type DtoSequelizeQuery,
  type IUseSequelizeQuery,
} from 'expresso-query/lib/interface'
import { env } from '~/config/env'

type ConnectType = 'postgres' | 'mysql' | 'mariadb'

/**
 * Create New Instance Query Sequelize from `expresso-query` Library
 * @param params
 * @returns
 */
export function useQuery(params: IUseSequelizeQuery): DtoSequelizeQuery {
  const dialect = env.SEQUELIZE_CONNECTION as ConnectType

  return useSequelize.queryBulider(params, { dialect })
}
