const service = require('../app/service')

module.exports = async (req, res, next) => {
  if (!req.user) {
    req.roles = ['$unauthenticated']
    return next()
  }
  const { phone } = req.user
  const user = await service.user.cacheGetUserByPhone(phone)
  req.user = user
  req.user.roles = user.Roles.map(({ code }) => code)
  req.roles = (req.user.roles || []).concat('$everyone', '$authenticated')
  return next()
}
