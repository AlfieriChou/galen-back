const appRoot = require('app-root-path')
const dir = require('dir_filenames')
const _ = require('lodash')

const files = dir(`${appRoot}/app/swagger`)
_.remove(files, n => n === `${appRoot}/app/swagger/index.js`)
files.map((item) => {
  const name = item.split('/').pop().replace(/\.\w+$/, '')
  exports[name] = require(item)
})
