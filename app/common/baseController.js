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
}

module.exports = BaseController
