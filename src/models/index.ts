/* eslint-disable import/no-dynamic-require */
import { Sequelize } from 'sequelize';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(`${__dirname}/../config/database`))[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {
  sequelize,
  Sequelize,
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
