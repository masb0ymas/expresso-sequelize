/* eslint-disable @typescript-eslint/no-var-requires */
import sequelize from 'sequelize'
const { MockQueryInterface, read } = require('./ReaderMigrationSequelize')

const newMockQueryInterface = new MockQueryInterface()

read(sequelize, newMockQueryInterface)

const SequelizeAttributes = newMockQueryInterface.attributeTables

export default SequelizeAttributes
