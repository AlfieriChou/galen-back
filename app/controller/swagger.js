const swagger = require('../common/swagger')

class SwaggerController {
  async doc (req, res) {
    const result = await swagger.generateSwagger()
    res.json(result)
  }
  async index (req, res) {
    await res.render('index.html', { url: 'swagger.json' })
  }
}

module.exports = new SwaggerController()
