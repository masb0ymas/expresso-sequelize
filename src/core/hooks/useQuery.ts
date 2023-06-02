import { useSequelize } from 'expresso-query'
import { type UseSequelizeQuery } from 'expresso-query/lib/interface'
import { SEQUELIZE_CONNECTION } from '~/config/env'
import { type DtoQueryEntity } from '~/core/interface/QueryFiltered'

type ConnectType = 'postgres' | 'mysql' | 'mariadb'

/**
 * Create New Instance Query Sequelize from `expresso-query` Library
 * @param params
 * @returns
 */
export function useQuery(params: UseSequelizeQuery): DtoQueryEntity {
  const connectType = SEQUELIZE_CONNECTION as ConnectType

  return useSequelize.queryBulider(params, { dialect: connectType })
}
