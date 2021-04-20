// this utils help you to get All Attributes from migrations file

class MockQueryInterface {
  constructor() {
    this.attributeTables = {}
  }

  setAttribute(tableName, attributes) {
    this.attributeTables[tableName] = {
      ...(this.attributeTables[tableName] || {}),
      ...(attributes || {}),
    }
  }

  deleteAttribute(tableName, attributeName) {
    const defTable = this.attributeTables[tableName]
    if (defTable) {
      delete defTable[attributeName]
    }
  }

  getAttribute(tableName, attributeName) {
    const defTable = this.attributeTables[tableName]
    if (defTable) {
      return defTable[attributeName]
    }

    return null
  }

  createTable(tableName, attributes) {
    this.setAttribute(tableName, attributes)
  }

  addColumn(table, key, attribute) {
    this.setAttribute(table, {
      [key]: attribute,
    })
  }

  changeColumn(tableName, attributeName, dataTypeOrOptions, options) {
    this.setAttribute(tableName, {
      [attributeName]: dataTypeOrOptions,
    })
  }

  removeColumn(tableName, attributeName) {
    this.deleteAttribute(tableName, attributeName)
  }

  renameColumn(tableName, attrNameBefore, attrNameAfter, options) {
    const curAttribute = this.getAttribute(tableName, attrNameBefore)
    this.setAttribute(tableName, {
      [attrNameAfter]: curAttribute,
    })
    this.deleteAttribute(tableName, attrNameBefore)
  }

  renameTable(before, after, options) {
    this.attributeTables[after] = this.attributeTables[before]

    delete this.attributeTables[before]
  }

  addConstraint() {
    return this
  }
}

const fs = require('fs')
const path = require('path')

function read(sequelize, mockQueryInterface, curPath) {
  const basePath = path.resolve(curPath)

  const files = fs.readdirSync(basePath)
  files.forEach((file) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const script = require([basePath, file].join('/'))
    script.up(mockQueryInterface, sequelize)
  })
}

module.exports = {
  MockQueryInterface,
  read,
}
