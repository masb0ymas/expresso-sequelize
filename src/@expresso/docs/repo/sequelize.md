# Using Sequelize

## Sequelize Model

In this boilerplate I use the `Sequelize ORM`. Full documentation of the [Sequelize ORM](https://sequelize.org/master/).

After you create the migration model, then you just need to reset the contents of the model, like this:

### Model by default

This model after generate with `npx sequelize-cli model:generate --name Role --attributes name:string`

```js
// models/role.js

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'Roles',
    }
  )
  return Role
}
```

### Simple Model

You can change it like this:

```js
// models/role.ts

import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'
import db from './_instance'

// entity
export interface RoleAttributes {
  id: string
  name: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

// creation attributes
interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

// instance
export interface RoleInstance
  extends Model<RoleAttributes, RoleCreationAttributes>,
    RoleAttributes {}

// class entity
class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  declare id: string
  declare name: string

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
  declare readonly deletedAt: Date
}

// init model
Role.init(
  {
    ...SequelizeAttributes.Roles,
  },
  // @ts-expect-error
  { sequelize: db.sequelize, tableName: 'Roles', paranoid: true }
)

export default Role

```

You must also import the index model

```js
// models/index.ts

import User from './user.ts'
import Role from './role.ts'
import Session from './session.ts'

...

const models = {
  ...
  Role,
  User,
  Session,
}

```

## Model Association

If you want to use associate you can use this method:

```js
// models/index.ts

...

import User from './user.ts'
import Role from './role.ts'
import Session from './session.ts'


const models = {
  ...
  Role,
  User,
  Session,
}

// relation
User.belongsTo(Role)
User.hasMany(Session)

Session.belongsTo(User)

export default models

```

## Using Sequelize Plugin

If you want to use the sequelize plugin, it's very easy. You just need to customize a query request like this:

```sh

http://localhost:8000/v1/user?filtered=[{"id": "email", "value": "example@mail.com"}]&sorted=[{"id": "email", "desc": true}]

```

filtered & sorted format is a `Array of Objects`

filtered query like this:

```json

?filtered=[
  {
    "id": "email",
    "value": "example@mail.com"
  },
  {
    "id": "Role.name",
    "value": "admin"
  }
]

```

sorted query like this:

```json

?sorted=[
  {
    "id": "email",
    "desc": false
  }
]

```

If the query filters don't work the way you want, you can also use manual queries.

```js
// controllers/user/service.ts
...
import models from '@database/models/index'

const { User, Role, Session } = models
const including = [{ model:Role }, { model:Session }]

public static async getAll(req: Request) {
  const { filtered, active } = req.getQuery()
  const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
    req.query,
    User,
    PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
  )

  // manual query
  const isActive = validateBoolean(active)

  // manual query
  queryFind.where = {
    ...queryFind.where,
    active: isActive
  }

  const data = await User.findAll({
    ...queryFind,
    order: order.length ? order : [['createdAt', 'desc']],
  })
  const total = await User.count({
    include: includeCount,
    where: queryFind.where,
  })

  return { message: `${total} data has been received.`, data, total }
}

```
