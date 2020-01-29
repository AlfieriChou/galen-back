module.exports = async (req, res, next) => {
  if (!req.user) {
    req.roles = ['$unauthenticated']
    return next()
  }
  // TODO: cacheGetUserByPhone
  req.roles = (req.user.roles || []).concat('$everyone', '$authenticated')
  return next()
}
