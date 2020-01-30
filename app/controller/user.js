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
}

module.exports = new UserController()
