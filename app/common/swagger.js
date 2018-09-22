const jsonSchema = require('./transform')
const _ = require('lodash')
const appRoot = require('app-root-path')
const dir = require('dir_filenames')

const generateSwagger = () => {
  const items = dir(`${appRoot}/app/swagger`)
  let methods = []
  let components = {}
  components.schemas = {}
  items.forEach(item => {
    let model = require(item)
    const files = item.split('/')
    const fileName = files.pop().replace(/\.\w+$/, '')
    let schemaName = fileName.slice(0, 1).toUpperCase() + fileName.slice(1)
    for (let index in model) {
      if (index === schemaName) {
        const modelSchema = jsonSchema.transform(model[index])
        let schema = {}
        schema[schemaName] = modelSchema
        components.schemas = _.merge(components.schemas, schema)
      } else {
        const content = {
          tags: model[index].tags,
          summary: model[index].summary
        }
        if (model[index].query) {
          content.parameters = []
          let params = jsonSchema.convert(model[index].query)
          for (let prop in params.properties) {
            let field = {}
            field.name = prop
            field.in = 'query'
            field.description = params.properties[prop].description
            field.schema = {
              'type': params.properties[prop].type
            }
            field.required = false
            content.parameters.push(field)
          }
        }
        if (model[index].params) {
          content.parameters = []
          let params = jsonSchema.convert(model[index].params)
          for (let prop in params.properties) {
            let field = {}
            field.name = prop
            field.in = 'path'
            field.description = params.properties[prop].description
            field.schema = {
              'type': params.properties[prop].type
            }
            field.required = true
            content.parameters.push(field)
          }
        }
        if (model[index].requestBody) {
          let params = jsonSchema.convert(model[index].requestBody.body)
          let request = {}
          request.requestBody = {}
          let bodySchema = request.requestBody
          bodySchema.required = true
          bodySchema.content = {
            'application/json': {
              'schema': {
                'type': params.type,
                'properties': params.properties,
                'required': model[index].requestBody.required
              }
            }
          }
          content.requestBody = request.requestBody
        }
        let result = {}
        if (model[index].output) {
          const output = model[index].output
          const typeList = ['array', 'object', 'number']
          if (typeList.indexOf(output.type) < 0) throw new Error('output type mast ba array or object or number!')
          switch (output.type) {
            case 'array':
              const arrayResult = output.result ? jsonSchema.convert(output.result) : { type: 'object', properties: {} }
              result = {
                type: 'array',
                items: arrayResult
              }
              break
            case 'object':
              const objectResult = output.result ? jsonSchema.convert(output.result) : { type: 'object', properties: {} }
              result = objectResult
              break
            case 'number':
              const code = { type: 'number', description: '返回标识' }
              result = {
                type: 'object',
                properties: {
                  result: code
                }
              }
          }
        }
        const schema = model[index].output ? result : { $ref: `#/components/schemas/${schemaName}` }
        content.responses = {
          200: {
            'description': 'response success',
            'content': {
              'application/json': {
                'schema': schema
              }
            }
          }
        }
        let swaggerMethod = {}
        swaggerMethod[(model[index].method).toString()] = content
        let swaggerItem = {}
        swaggerItem[(model[index].path).toString()] = swaggerMethod
        methods.push(swaggerItem)
      }
    }
  })
  let mergeMethod = {}
  for (let i = 0; i < methods.length; ++i) {
    mergeMethod = _.merge(mergeMethod, methods[i])
  }
  let swagger = {}
  swagger.openapi = '3.0.0'
  swagger.info = {
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
  }
  swagger.paths = mergeMethod
  swagger.components = components
  return swagger
}

module.exports = {
  generateSwagger
}
