const appRoot = require('app-root-path')
const dir = require('dir_filenames')
const _ = require('lodash')

const files = dir(`${appRoot}/app/controller`)
_.remove(files, n => n === `${appRoot}/app/controller/index.js`)
files.forEach((item) => {
  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  const name = item.split('/').pop().replace(/\.\w+$/, '')
  exports[name] = require(item)
  /* eslint-enable global-require */
  /* eslint-enable import/no-dynamic-require */
})
