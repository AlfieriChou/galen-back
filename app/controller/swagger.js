const path = require('path')
const generateSwaggerDoc = require('../common/swagger')

class SwaggerController {
  // eslint-disable-next-line class-methods-use-this
  async doc (req, res) {
    const result = await generateSwaggerDoc({
      title: 'Demo API document',
      version: 'v3',
      description: 'Using swagger3.0 & sequelize to generate document',
      contact: {
        name: 'AlfieriChou',
        email: 'alfierichou@gmail.com',
        url: 'https://alfierichou.com'
      },
      license: {
        name: 'MIT',
        url: 'https://github.com/AlfieriChou/joi_swagger_three/blob/master/LICENSE'
      }
    }, path.resolve(__dirname, '../swagger'))
    res.json(result)
  }

  // eslint-disable-next-line class-methods-use-this
  async index (req, res) {
    await res.render('index.html', { url: 'swagger.json' })
  }
}

module.exports = new SwaggerController()
