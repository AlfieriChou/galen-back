const dir = require('dir_filenames')
const path = require('path')
const express = require('express')
const controller = require('../controller')

const api = express.Router()

dir(path.resolve(__dirname, './'))
  .filter(n => !n.endsWith('index.js'))
  .forEach(async (filename) => {
    const modelName = path.basename(filename).replace(/\.\w+$/, '')
    // eslint-disable-next-line global-require, import/no-dynamic-require
    await Object.entries(require(filename))
      .reduce(async (promise, [handler, apiInfo]) => {
        await promise
        if (/^[A-Z]/.test(handler)) {
          return
        }
        api[apiInfo.method](apiInfo.path, controller[modelName][handler])
      }, Promise.resolve())
  })

module.exports = api
