import { Model, Optional } from 'sequelize'
import SequelizeAttributes from 'utils/SequelizeAttributes'

import db from './_instance'

export interface HobbyAttributes {
  id: string
  name: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

interface HobbyCreationAttributes extends Optional<HobbyAttributes, 'id'> {}

export interface HobbyInstance
  extends Model<HobbyAttributes, HobbyCreationAttributes>,
    HobbyAttributes {}

const Hobby = db.sequelize.define<HobbyInstance>(
  'Hobbies',
  {
    ...SequelizeAttributes.Hobbies,
  },
  { paranoid: true }
)

export default Hobby
