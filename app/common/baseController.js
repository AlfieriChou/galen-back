const jwt = require('jsonwebtoken')
const db = require('../model')
const config = require('../../config')

class BaseController {
  // eslint-disable-next-line class-methods-use-this
  get db () {
    return db
  }

  // eslint-disable-next-line class-methods-use-this
  createToken (data, expiresIn = '24h') {
    return jwt.sign(data, config.jwt.privateKey, {
      algorithm: 'RS256',
      expiresIn
    })
  }

  static async index (ctx, modelName) {
    return 'hello'
  }

  static async create (ctx, modelName) {
    const { req: { body } } = ctx
    return db[modelName].create(body)
  }

  static async show (ctx, modelName) {
    const { req: { params: { id } } } = ctx
    return db[modelName].findByPk(id)
  }

  static async update (ctx, modelName) {
    const { req: { body, params: { id } } } = ctx
    return db[modelName].update(body, { where: { id } })
  }

  static async destroy (ctx, modelName) {
    const { req: { params: { id } } } = ctx
    return db[modelName].destroy({ where: { id } })
  }
}

module.exports = BaseController
