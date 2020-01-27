const dir = require('dir_filenames')
const path = require('path')

module.exports = dir(path.resolve(__dirname, './'))
  .filter(n => !n.endsWith('index.js'))
  .reduce((acc, item) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    acc[path.basename(item).replace(/\.\w+$/, '')] = require(item)
    return acc
  }, {})
