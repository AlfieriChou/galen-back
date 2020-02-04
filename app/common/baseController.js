const jwt = require('jsonwebtoken')
const db = require('../model')
const config = require('../../config')
const parseQuery = require('./parseQueryFilter')

class BaseController {
  // eslint-disable-next-line class-methods-use-this
  get db () {
    return db
  }

  // eslint-disable-next-line class-methods-use-this
  get parseQuery () {
    return parseQuery
  }

  // eslint-disable-next-line class-methods-use-this
  createToken (data, expiresIn = '24h') {
    return jwt.sign(data, config.jwt.privateKey, {
      algorithm: 'RS256',
      expiresIn
    })
  }

  static async index (ctx, modelName) {
    const { req: { query } } = ctx
    const filter = parseQuery(query)
    return {
      count: await db[modelName].count(filter),
      offset: parseInt(query.offset, 10) || 0,
      limit: parseInt(query.limit, 10) || 10,
      datas: await db[modelName].findAll(filter)
    }
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
