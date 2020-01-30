const dir = require('dir_filenames')
const path = require('path')
const express = require('express')
const { Validator } = require('jsonschema')
const { convert } = require('../common/transform')
const controller = require('../controller')

const api = express.Router()
const v = new Validator()

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
      status: 403,
      message: 'permission denied'
    })
  }
  return next()
}

const validate = async apiInfo => async (req, res, next) => {
  if (!apiInfo.requestBody) {
    return next()
  }
  const { body, required = [] } = apiInfo.requestBody
  const jsonSchema = convert(body)
  jsonSchema.required = required
  const validateRet = await v.validate(req.body, jsonSchema)
  if (validateRet.errors.length > 0) {
    return res.status(400).send({
      status: 400,
      message: validateRet.errors[0].message
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
        api[apiInfo.method](
          apiInfo.path,
          await checkRoles(apiInfo),
          await validate(apiInfo),
          controller[modelName][handler]
        )
      }, Promise.resolve())
  })

module.exports = api
