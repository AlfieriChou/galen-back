const BaseController = require('../common/baseController')
const schema = require('../routes')

class UserController extends BaseController {
  // eslint-disable-next-line class-methods-use-this
  async index (req, res) {
    // const params = req.query
    res.json('hello')
  }

  async create (req, res) {
    const params = req.body
    try {
      await super.validate(schema.user.create, params)
      res.json(params)
    } catch (err) {
      res.status(422).send(err)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async show (req, res) {
    res.json('hello')
  }

  // eslint-disable-next-line class-methods-use-this
  async update (req, res) {
    res.json('hello')
  }
}

module.exports = new UserController()
