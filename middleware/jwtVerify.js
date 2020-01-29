const service = require('../app/service')
const expireStore = require('../app/common/expireStore')

const sessionStore = expireStore({}, 60000)

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next()
  }
  const token = req.headers.authorization
  let userInfo = sessionStore[token]
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
    sessionStore[token] = userInfo
  }
  req.user = userInfo
  return next()
}
