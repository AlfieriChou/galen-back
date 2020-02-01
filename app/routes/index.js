const dir = require('dir_filenames')
const path = require('path')
const express = require('express')
const { Validator } = require('jsonschema')
const _ = require('lodash')
const controller = require('../controller')
const {
  logger, generateSwaggerDoc, convert, camelizeKeys, BaseController
} = require('../common')

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
  const intersectionRoles = intersection(apiInfo.roles, req.roles)
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
        if (modelName === 'swagger') {
          if (apiInfo.path === '/swagger.json') {
            api[apiInfo.method](apiInfo.path, async (req, res) => {
              const result = await generateSwaggerDoc({
                title: 'Demo API document',
                version: 'v3',
                description: 'Using swagger3.0 & sequelize to generate document',
                contact: {
                  name: 'AlfieriChou',
                  email: 'alfierichou@gmail.com',
                  url: 'https://alfierichou.com'
                },
                license: {
                  name: 'MIT',
                  url: 'https://github.com/AlfieriChou/joi_swagger_three/blob/master/LICENSE'
                }
              }, path.resolve(__dirname, '../routes'))
              res.json(result)
            })
          }
          if (apiInfo.path === '/apidoc') {
            api[apiInfo.method](apiInfo.path, async (req, res) => {
              await res.render('index.html', { url: 'swagger.json' })
            })
          }
          return
        }
        api[apiInfo.method](
          apiInfo.path,
          await checkRoles(apiInfo),
          await validate(apiInfo),
          async (req, res) => {
            const ctx = { req, res }
            ctx.logger = logger
            ctx.throw = (status, message, options = {}) => res.status(status).send({
              status,
              message,
              ...options
            })
            let ret
            if (controller[modelName] && controller[modelName][handler]) {
              ret = await controller[modelName][handler](ctx)
            } else {
              ret = await BaseController[handler](ctx, _.upperFirst(modelName))
            }
            res.json({
              status: 200,
              message: 'success',
              result: camelizeKeys(ret)
            })
          }
        )
      }, Promise.resolve())
  })

module.exports = api
