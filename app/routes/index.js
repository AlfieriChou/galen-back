const dir = require('dir_filenames')
const path = require('path')
const express = require('express')
const controller = require('../controller')

const api = express.Router()

const intersection = (a, b) => {
  const s = new Set(b)
  return a.filter(x => s.has(x))
}

const checkRoles = async apiInfo => async (req, res, next) => {
  if (!apiInfo.roles) {
    return next()
  }
  const intersectionRoles = intersection(apiInfo.roles, req.roles = [])
  if (intersectionRoles.length === 0) {
    return res.status(403).send({
      message: 'permission denied'
    })
  }
  return next()
}

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
        api[apiInfo.method](apiInfo.path, await checkRoles(apiInfo), controller[modelName][handler])
      }, Promise.resolve())
  })

module.exports = api
