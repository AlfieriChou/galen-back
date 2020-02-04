const { BaseController, verifyPassword, generateHash } = require('../common')

class UserController extends BaseController {
  // eslint-disable-next-line class-methods-use-this
  async create (ctx) {
    return ctx.req.body
  }

  // eslint-disable-next-line class-methods-use-this
  async show (ctx) {
    return 'hello'
  }

  // eslint-disable-next-line class-methods-use-this
  async update (ctx) {
    return 'hello'
  }

  async register (ctx) {
    const { req: { body: { phone, password } } } = ctx
    const user = await super.db.User.findOne({ where: { phone } })
    if (user) {
      ctx.throw(400, 'user is registered')
    }
    const ret = await super.db.User.create({
      phone,
      password: await generateHash(password)
    })
    return ret
  }

  async login (ctx) {
    const { req: { body: { phone, password } } } = ctx
    const user = await super.db.User.findOne({ where: { phone } })
    if (!user) {
      ctx.throw(400, 'user not registered')
    }
    if (!verifyPassword(user.password, password)) {
      ctx.throw(400, 'password error')
    }
    const token = super.createToken({ phone })
    return {
      user,
      token
    }
  }
}

module.exports = new UserController()
