const appRoot = require('app-root-path')
const dir = require('dir_filenames')
const _ = require('lodash')
let files = dir(`${appRoot}/src/swagger`)
_.remove(files, n => {
  return n === `${appRoot}/src/swagger/index.js`
})
files.map(item => {
  let name = item.split('/').pop().replace(/\.\w+$/, '')
  exports[name] = require(item)
})
