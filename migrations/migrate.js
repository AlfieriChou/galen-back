const dir = require('dir_filenames')
const path = require('path')
const _ = require('lodash')
const queryInterface = require('.')

const baseOptArr = ['createTable']

const migration = async () => {
  await dir(path.resolve(__dirname, '../app/model'))
    .filter(n => !n.endsWith('index.js'))
    .reduce(async (promise, filePath) => {
      await promise
      const tables = await queryInterface.showAllTables()
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const model = require(filePath)
      const tableName = model.tableName || _.snakeCase(path.basename(filePath).replace(/\.\w+$/, ''))
      await Object.entries(model.migrations).reduce(async (rsPromise, [opt, optValue]) => {
        await rsPromise
        if (!baseOptArr.includes(opt)) {
          throw new Error(`${tableName} migrations has invlid opt ${opt}!`)
        }
        if (opt === 'createTable' && !tables.includes(tableName)) {
          await queryInterface.createTable(
            tableName,
            Object.entries(optValue).reduce((acc, [key, value]) => {
              acc[_.snakeCase(key)] = value
              return acc
            }, {}),
            { charset: 'utf8' }
          )
        }
      }, Promise.resolve())
    }, Promise.resolve())
}

migration()
  .then(() => {
    console.log('sync done!')
    process.exit()
  })
