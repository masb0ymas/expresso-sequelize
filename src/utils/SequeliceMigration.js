exports.migrate = (tableName, newColumns) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map((item) =>
          queryInterface.addColumn(tableName, item.key, {
            type: item.type,
          })
        )
      )
    },

    down: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map((item) => queryInterface.removeColumn(tableName, item.key))
      )
    },
  }
}

exports.rename = (tableName, newColumns) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map((item) =>
          queryInterface.renameColumn(
            tableName,
            item.nameBefore,
            item.nameAfter
          )
        )
      )
    },

    down: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map((item) =>
          queryInterface.renameColumn(
            tableName,
            item.nameAfter,
            item.nameBefore
          )
        )
      )
    },
  }
}

exports.addColumns = (tableName, newColumns) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map((item) => {
          const { key, type, ...options } = item
          return queryInterface.addColumn(tableName, key, {
            type,
            ...options,
          })
        })
      )
    },

    down: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map((item) => queryInterface.removeColumn(tableName, item.key))
      )
    },
  }
}

exports.removeColumns = (tableName, cols) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = cols(Sequelize)

      return Promise.all(
        columns.map((item) => queryInterface.removeColumn(tableName, item.key))
      )
    },

    down: (queryInterface, Sequelize) => {
      const columns = cols(Sequelize)

      return Promise.all(
        columns.map((item) => {
          const { key, type, ...options } = item
          return queryInterface.addColumn(tableName, key, {
            type,
            ...options,
          })
        })
      )
    },
  }
}

exports.changeColumns = (tableName, changeColumns) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = changeColumns(Sequelize)

      return Promise.all(
        columns.map((item) => {
          const { key, ...dataTypeOrOptions } = item

          return queryInterface.changeColumn(
            tableName,
            key,
            {
              ...dataTypeOrOptions,
            },
            null
          )
        })
      )
    },

    down: (queryInterface, Sequelize) => {
      return true
    },
  }
}

exports.renameColumns = (tableName, newColumns) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map((item) =>
          queryInterface.renameColumn(
            tableName,
            item.nameBefore,
            item.nameAfter
          )
        )
      )
    },

    down: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map((item) =>
          queryInterface.renameColumn(
            tableName,
            item.nameAfter,
            item.nameBefore
          )
        )
      )
    },
  }
}

exports.renameTables = (changeTables) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = changeTables(Sequelize)

      return Promise.all(
        columns.map((item) =>
          queryInterface.renameTable(item.nameBefore, item.nameAfter)
        )
      )
    },

    down: (queryInterface, Sequelize) => {
      const columns = changeTables(Sequelize)

      return Promise.all(
        columns.map((item) =>
          queryInterface.renameTable(item.nameAfter, item.nameBefore)
        )
      )
    },
  }
}

const getDefaultNameColumns = (obj) => {
  const entries = Object.entries(obj)
  return entries.map((x) => x[0])
}

exports.createTable = (tableName, newColumns) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)
      const defaultColumn = {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }

      const defNameColumns = getDefaultNameColumns(defaultColumn)
      for (let i = 0; i < defNameColumns.length; i += 1) {
        const name = defNameColumns[i]
        if (columns[name]) {
          defaultColumn[name] = columns[name]
          delete columns[name]
        }
      }

      return queryInterface.createTable(tableName, {
        ...defaultColumn,
        ...columns,
      })
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable(tableName)
    },
  }
}
