const jwt = require('jsonwebtoken')
const ExpireStore = require('expire-store')
const config = require('../../config')

class JWTAuthService {
  constructor () {
    this.verifyTokenStore = new ExpireStore(20000)
  }

  async verifyToken (token) {
    let payload = this.verifyTokenStore.get(token)
    if (typeof payload === 'undefined') {
      payload = await jwt.verify(token, config.jwt.publicKey, { algorithms: ['RS256'] })
      this.verifyTokenStore.set(token, payload)
    }
    return payload
  }
}

module.exports = new JWTAuthService()
