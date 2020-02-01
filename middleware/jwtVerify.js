const ExpireStore = require('expire-store')
const service = require('../app/service')

const sessionStore = new ExpireStore(60000)

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next()
  }
  const token = req.headers.authorization
  let userInfo = sessionStore.get(token)
  if (typeof userInfo === 'undefined') {
    try {
      const payload = await service.jwt.verifyToken(token)
      userInfo = {
        phone: payload.phone
      }
    } catch (err) {
      return res.status(403).send({
        message: 'invalid token',
        err
      })
    }
    sessionStore.set(token, userInfo)
  }
  req.user = userInfo
  return next()
}
