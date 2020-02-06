const dir = require('dir_filenames')
const path = require('path')
const _ = require('lodash')
const Sequelize = require('sequelize')

let env = process.argv[2]
if (!env) env = 'default'
const configPath = path.join(__dirname, '../config', `config.${env}.js`)
const {
  mysql: {
    host, database, user, password
  }
// eslint-disable-next-line global-require, import/no-dynamic-require
} = require(configPath)

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  logging: false
})

const queryInterface = sequelize.getQueryInterface()

const baseOptArr = ['createTable', 'addColumn', 'changeColumn', 'renameColumn', 'addIndex']

const migration = async () => {
  await dir(path.resolve(__dirname, '../app/model'))
    .filter(n => !n.endsWith('index.js'))
    .reduce(async (promise, filePath) => {
      await promise
      const tables = await queryInterface.showAllTables()
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const model = require(filePath)
      const tableName = model.tableName || _.snakeCase(path.basename(filePath).replace(/\.\w+$/, ''))
      // eslint-disable-next-line consistent-return
      await Object.entries(model.migrations).reduce(async (rsPromise, [opt, optValue]) => {
        await rsPromise
        if (!baseOptArr.includes(opt)) {
          throw new Error(`${tableName} migrations has invlid opt ${opt}!`)
        }
        if (opt === 'createTable' && !tables.includes(tableName)) {
          return queryInterface.createTable(
            tableName,
            Object.entries(optValue).reduce((acc, [key, value]) => {
              acc[_.snakeCase(key)] = value
              return acc
            }, {}),
            { charset: 'utf8' }
          )
        }
        if (opt === 'addColumn') {
          const describe = await queryInterface.describeTable(tableName)
          if (!describe[_.snakeCase(optValue.field)]) {
            return queryInterface.addColumn(
              tableName,
              _.snakeCase(optValue.field),
              Object.assign(
                optValue.type,
                { after: _.snakeCase(optValue.after || 'id') }
              )
            )
          }
        }
        if (opt === 'changeColumn') {
          const describe = await queryInterface.describeTable(tableName)
          if (describe[_.snakeCase(optValue.field)]) {
            return queryInterface.changeColumn(
              tableName,
              _.snakeCase(optValue.field),
              optValue.type
            )
          }
        }
        if (opt === 'renameColumn') {
          const describe = await queryInterface.describeTable(tableName)
          if (describe[_.snakeCase(optValue.before)]) {
            return queryInterface.renameColumn(
              tableName,
              _.snakeCase(optValue.before),
              _.snakeCase(optValue.after)
            )
          }
        }
        if (opt === 'addIndex') {
          return queryInterface.addIndex(
            tableName,
            optValue.attributes.map(v => _.snakeCase(v)),
            optValue.options
          )
        }
      }, Promise.resolve())
    }, Promise.resolve())
}

migration()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('sync done!')
    process.exit()
  })
