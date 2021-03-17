# Using Sequelize

### Documentation Sequelize

In this boilerplate I use the `Sequelize ORM`. Full documentation of the [Sequelize ORM](https://sequelize.org/master/).

After you create the migration model, then you just need to reset the contents of the model, like this:

#### Model by default

This model after generate with `npx sequelize model:generate`

```javascript
// gender.js

'use strict';
const {
  Model
} = require('sequelize');
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
  };
  Gender.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Gender',
  });
  return Gender;
};
```

#### Simple Model

You can change it like this:

```javascript
// gender.ts

import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

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