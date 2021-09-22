# Using Sequelize

## Sequelize Model

In this boilerplate I use the `Sequelize ORM`. Full documentation of the [Sequelize ORM](https://sequelize.org/master/).

After you create the migration model, then you just need to reset the contents of the model, like this:

### Model by default

This model after generate with `npx sequelize model:generate`

```js
// models/gender.js

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Gender extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Gender.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Gender',
    }
  )
  return Gender
}
```

### Simple Model

You can change it like this:

```js
// models/gender.ts

import SequelizeAttributes from '@expresso/utils/SequelizeAttributes'
import { Model, Optional } from 'sequelize'

import db from './_instance'

export interface GenderAttributes {
  id: string
  name: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

interface GenderCreationAttributes extends Optional<GenderAttributes, 'id'> {}

export interface GenderInstance
  extends Model<GenderAttributes, GenderCreationAttributes>,
    GenderAttributes {}

const Gender = db.sequelize.define<GenderInstance>(
  'Genders',
  {
    ...SequelizeAttributes.Genders,
  },
  { paranoid: true }
)

export default Gender
```

You must also import the index model

```js
// models/index.ts

...

const models = {
  ...
  Session,
  Gender,
}

```

## Model Association

If you want to use associate you can use this method:

```js
// models/user.ts

...

User.associate = (models: MyModels) => {
  // has many relationship
  User.hasMany(models.Session, { foreignKey: 'UserId' })

  // belongs to many relationship
  User.belongsToMany(models.Role, { through: models.UserRole })
}

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

public static async getAll(req: Request) {
  const { filtered, active } = req.query
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
