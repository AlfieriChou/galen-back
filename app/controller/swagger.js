const swagger = require('../common/swagger')

class SwaggerController {
  async doc (req, res) {
    const result = await swagger.generateSwagger({
      'title': 'Demo API document',
      'version': 'v3',
      'description': 'Using swagger3.0 & sequelize to generate document',
      'contact': {
        'name': 'AlfieriChou',
        'email': 'alfierichou@gmail.com',
        'url': 'https://alfierichou.com'
      },
      'license': {
        'name': 'MIT',
        'url': 'https://github.com/AlfieriChou/joi_swagger_three/blob/master/LICENSE'
      }
    })
    res.json(result)
  }
  async index (req, res) {
    await res.render('index.html', { url: 'swagger.json' })
  }
}

module.exports = new SwaggerController()
