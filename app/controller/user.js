const { verifyPassword, generateHash } = require('../common/brypt')
const BaseController = require('../common/baseController')

class UserController extends BaseController {
  // eslint-disable-next-line class-methods-use-this
  async index (req, res) {
    // const params = req.query
    res.json('hello')
  }

  // eslint-disable-next-line class-methods-use-this
  async create (req, res) {
    const params = req.body
    res.json(params)
  }

  // eslint-disable-next-line class-methods-use-this
  async show (req, res) {
    res.json('hello')
  }

  // eslint-disable-next-line class-methods-use-this
  async update (req, res) {
    res.json('hello')
  }

  // eslint-disable-next-line consistent-return
  async register (req, res) {
    const { body: { phone, password } } = req
    const user = await super.db.User.findOne({ where: { phone } })
    if (user) {
      return res.status(400).send({
        status: 400,
        message: 'user is registered'
      })
    }
    const ret = await super.db.User.create({
      phone,
      password: await generateHash(password)
    })
    res.json({
      status: 200,
      message: 'user registered',
      result: ret
    })
  }

  // eslint-disable-next-line consistent-return
  async login (req, res) {
    const { body: { phone, password } } = req
    const user = await super.db.User.findOne({ where: { phone } })
    if (!user) {
      return res.status(400).send({
        status: 400,
        message: 'user not registered'
      })
    }
    if (!verifyPassword(user.password, password)) {
      return res.status(400).send({
        status: 400,
        message: 'password error'
      })
    }
    const token = super.createToken({ phone })
    res.json({
      status: 200,
      message: 'login success',
      result: {
        user,
        token
      }
    })
  }
}

module.exports = new UserController()
