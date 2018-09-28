const path = require('path')
const fs = require('fs')
const appRoot = require('app-root-path')
const dir = path.resolve(`${appRoot}/app/controller/`)
fs.readdirSync(dir).forEach(file => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    const name = file.replace('.js', '')
    exports[name] = require('./' + file)
  }
})
