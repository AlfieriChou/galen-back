const service = require('../app/service')
const { camelizeKeys } = require('../app/common')

module.exports = async (req, res, next) => {
  if (!req.user) {
    req.roles = ['$unauthenticated']
    return next()
  }
  const { phone } = req.user
  const user = await service.user.cacheGetUserByPhone(phone)
  req.user = camelizeKeys(user)
  req.user.stateUserRoles = camelizeKeys(user).roles.map(({ code }) => code)
  req.roles = (req.user.stateUserRoles || []).concat('$everyone', '$authenticated')
  return next()
}
