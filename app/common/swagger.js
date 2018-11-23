const jsonSchema = require('./transform')
const _ = require('lodash')
const appRoot = require('app-root-path')
const dir = require('dir_filenames')

const generateSwagger = (info) => {
  const items = dir(`${appRoot}/app/swagger`)
  _.remove(items, n => {
    return n === `${appRoot}/app/swagger/index.js`
  })
  let methods = []
  let components = {}
  components.schemas = {}
  items.map(item => {
    let model = require(item)
    const fileName = item.split('/').pop().replace(/\.\w+$/, '')
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
        if (model[index].output) {
          let result = {}
          const response = model[index].output
          const keys = Object.keys(response)
          keys.map(key => {
            let outputSchema
            const output = response[key]
            const typeList = ['array', 'object', 'number']
            if (typeList.indexOf(output.type) < 0) throw new Error('output type mast ba array or object or number!')
            switch (output.type) {
              case 'array':
                const arrayResult = output.result ? jsonSchema.convert(output.result) : { type: 'object', properties: {} }
                outputSchema = {
                  type: 'array',
                  items: arrayResult
                }
                break
              case 'object':
                const objectResult = output.result ? jsonSchema.convert(output.result) : { type: 'object', properties: {} }
                outputSchema = objectResult
                break
              case 'number':
                const code = { type: 'number', description: '返回标识' }
                outputSchema = {
                  type: 'object',
                  properties: {
                    result: code
                  }
                }
                break
            }
            content.responses = _.merge(result, result[key] = {
              'description': 'response success',
              'content': {
                'application/json': {
                  'schema': outputSchema
                }
              }
            })
          })
        } else {
          content.responses = {
            200: {
              'description': 'response success',
              'content': {
                'application/json': {
                  'schema': { $ref: `#/components/schemas/${schemaName}` }
                }
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
  swagger.info = info
  swagger.paths = mergeMethod
  swagger.components = components
  return swagger
}

module.exports = {
  generateSwagger
}
