const Sequelize = require('sequelize')

module.exports = {
  index: {
    path: '/apidoc',
    method: 'get',
    tags: ['swagger'],
    summary: 'api文档',
    output: {
      304: {
        type: 'html'
      }
    }
  },
  doc: {
    path: '/swagger.json',
    method: 'get',
    tags: ['swagger'],
    summary: 'swagger json 数据文档',
    output: {
      200: {
        type: 'object',
        result: {
          openapi: { type: Sequelize.STRING },
          info: {
            type: Sequelize.JSON,
            keys: {
              title: { type: Sequelize.STRING },
              version: { type: Sequelize.STRING },
              contact: {
                type: Sequelize.JSON,
                keys: {
                  name: { type: Sequelize.STRING },
                  email: { type: Sequelize.STRING },
                  url: { type: Sequelize.STRING }
                }
              },
              license: {
                type: Sequelize.JSON,
                keys: {
                  name: { type: Sequelize.STRING },
                  url: { type: Sequelize.STRING }
                }
              }
            }
          },
          paths: { type: Sequelize.JSON },
          components: { type: Sequelize.JSON }
        }
      }
    }
  }
}
