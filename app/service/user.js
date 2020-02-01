const ExpireStore = require('expire-store')
const BaseService = require('../common/baseService')

const phoneStore = new ExpireStore(20000)

class UserService extends BaseService {
  async cacheGetUserByPhone (phone) {
    let user = phoneStore.get(phone)
    if (typeof user === 'undefined') {
      user = await super.db.User.findOne({
        where: { phone },
        include: [{
          model: super.db.Role
        }]
      })
      phoneStore.set(phone, user)
    }
    return user.toJSON()
  }
}

module.exports = new UserService()
