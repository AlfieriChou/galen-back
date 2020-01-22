const _ = require('lodash')
const dir = require('dir_filenames')
const path = require('path')
const jsonSchema = require('./transform')

const resTypeList = ['array', 'object', 'number']

const generateSwaggerDoc = (info, paths) => {
  const items = dir(paths).filter(n => !n.endsWith('index.js'))
  const methods = []
  const components = {
    schemas: {}
  }
  items.forEach((item) => {
    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    const model = require(item)
    /* eslint-enable global-require */
    /* eslint-enable import/no-dynamic-require */
    const fileName = path.basename(item).replace(/\.\w+$/, '')
    const schemaName = _.upperFirst(fileName)
    Object.entries(model).forEach(([schemaKey, schemaValue]) => {
      if (schemaKey === schemaName) {
        components.schemas[schemaName] = jsonSchema.transform(schemaValue)
      } else {
        const content = {
          tags: schemaValue.tags,
          summary: schemaValue.summary,
          responses: {
            200: {
              description: 'response success',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${schemaName}` }
                }
              }
            }
          }
        }
        if (schemaValue.query || schemaValue.params) {
          const params = schemaValue.query
            ? jsonSchema.convert(schemaValue.query) : jsonSchema.convert(schemaValue.params)
          content.parameters = Object.entries(params.properties)
            .reduce((ret, [prop, propValue]) => {
              ret.push({
                name: prop,
                in: schemaValue.query ? 'query' : 'path',
                description: propValue.description,
                schema: {
                  type: propValue.type
                },
                required: !schemaValue.query
              })
              return ret
            }, [])
        }
        if (schemaValue.requestBody) {
          const params = jsonSchema.convert(schemaValue.requestBody.body)
          content.requestBody = {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: params.type,
                  properties: params.properties,
                  required: schemaValue.requestBody.required
                }
              }
            }
          }
        }
        if (schemaValue.output) {
          const response = schemaValue.output
          Object.keys(response).forEach((key) => {
            let outputSchema
            const output = response[key]
            if (!resTypeList.includes(output.type)) throw new Error('output type mast ba array or object or number!')
            // eslint-disable-next-line default-case
            switch (output.type) {
              case 'array':
                outputSchema = {
                  type: 'array',
                  items: output.result ? jsonSchema.convert(output.result) : { type: 'object', properties: {} }
                }
                break
              case 'object':
                outputSchema = output.result ? jsonSchema.convert(output.result) : { type: 'object', properties: {} }
                break
              case 'number':
                outputSchema = {
                  type: 'object',
                  properties: {
                    result: { type: 'number', description: '返回标识' }
                  }
                }
                break
            }
            content.responses[key] = {
              description: 'response success',
              content: {
                'application/json': {
                  schema: outputSchema
                }
              }
            }
          })
        }
        const swaggerItem = {}
        swaggerItem[schemaValue.path] = {}
        swaggerItem[schemaValue.path][schemaValue.method] = content
        methods.push(swaggerItem)
      }
    })
  })
  return {
    openapi: '3.0.0',
    info,
    paths: methods.reduce((acc, method) => _.merge(acc, method), {}),
    components
  }
}

module.exports = generateSwaggerDoc
