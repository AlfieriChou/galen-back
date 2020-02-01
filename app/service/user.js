const ExpireStore = require('expire-store')
const { BaseService } = require('../common')

const phoneStore = new ExpireStore(20000)

class UserService extends BaseService {
  async cacheGetUserByPhone (phone) {
    let user = phoneStore.get(phone)
    if (typeof user === 'undefined') {
      const userRet = await super.db.User.findOne({
        where: { phone },
        include: [{
          model: super.db.Role
        }]
      })
      user = userRet.toJSON()
      phoneStore.set(phone, user)
    }
    return user
  }
}

module.exports = new UserService()
