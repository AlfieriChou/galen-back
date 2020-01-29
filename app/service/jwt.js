const jwt = require('jsonwebtoken')
const config = require('../../config')
const expireStore = require('../common/expireStore')

class JWTAuthService {
  // eslint-disable-next-line class-methods-use-this
  createToken (data, key) {
    return jwt.sign(data, key, {
      algorithm: 'RS256'
    })
  }

  // eslint-disable-next-line class-methods-use-this
  async verifyToken (token) {
    let payload = JWTAuthService.verifyTokenStore[token]
    if (typeof payload === 'undefined') {
      payload = await jwt.verify(token, config.jwt.publicKey, { algorithms: ['RS256'] })
      JWTAuthService.verifyTokenStore[token] = payload
    }
    return payload
  }
}

JWTAuthService.verifyTokenStore = expireStore({}, 20000)

module.exports = new JWTAuthService()
