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
          info: { type: Sequelize.JSON },
          paths: { type: Sequelize.JSON },
          components: { type: Sequelize.JSON }
        }
      }
    }
  }
}
