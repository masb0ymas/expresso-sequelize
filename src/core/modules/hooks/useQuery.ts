import { useSequelize } from 'expresso-query'
import {
  DtoSequelizeQuery,
  UseQuerySequelize,
} from 'expresso-query/lib/sequelize/types'
import { env } from '~/config/env'

type ConnectType = 'postgres' | 'mysql' | 'mariadb'

/**
 * Create New Instance Query Sequelize from `expresso-query` Library
 * @param params
 * @returns
 */
export function useQuery(params: UseQuerySequelize): DtoSequelizeQuery {
  const dialect = env.SEQUELIZE_CONNECTION as ConnectType

  return useSequelize.queryBulider(params, { dialect })
}
