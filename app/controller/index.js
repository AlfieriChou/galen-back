const appRoot = require('app-root-path')
const dir = require('dir_filenames')
const _ = require('lodash')
let files = dir(`${appRoot}/src/controller`)
_.remove(files, n => {
  return n === `${appRoot}/src/controller/index.js`
})
files.map(item => {
  let name = item.split('/').pop().replace(/\.\w+$/, '')
  exports[name] = require(item)
})
