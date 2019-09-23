const BaseController = require('../common/base_controller')
const schema = require('../swagger')

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
}

module.exports = new UserController()
