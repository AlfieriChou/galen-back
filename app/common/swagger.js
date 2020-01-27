const _ = require('lodash')
const dir = require('dir_filenames')
const path = require('path')
const jsonSchema = require('./transform')

const resTypeList = ['array', 'object', 'number']

const generateSwaggerDoc = async (info, paths) => {
  const items = dir(paths).filter(n => !n.endsWith('index.js'))
  const components = {
    schemas: {}
  }
  const methods = await items.reduce(async (methodRetPromise, item) => {
    const methodRet = await methodRetPromise
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const model = require(item)
    const schemaName = _.upperFirst(path.basename(item).replace(/\.\w+$/, ''))
    await Object.entries(model).reduce(async (promise, [schemaKey, schemaValue]) => {
      await promise
      if (schemaKey === schemaName) {
        components.schemas[schemaName] = jsonSchema.transform(schemaValue)
        return
      }
      const content = {
        tags: schemaValue.tags || '',
        summary: schemaValue.summary || ''
      }
      if (schemaValue.query || schemaValue.params) {
        const params = schemaValue.query
          ? jsonSchema.convert(schemaValue.query) : jsonSchema.convert(schemaValue.params)
        content.parameters = Object.entries(params.properties)
          .reduce((ret, [propKey, propValue]) => {
            ret.push({
              name: propKey,
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
        content.responses = await Object.entries(schemaValue.output)
          .reduce(async (resPromise, [responseKey, responseValue]) => {
            const outputDatas = await resPromise
            if (responseValue.type === 'html') {
              outputDatas[responseKey] = {
                description: 'response success',
                content: {
                  'text/html': {}
                }
              }
              return outputDatas
            }
            outputDatas[200] = {
              description: 'response success',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${schemaName}` }
                }
              }
            }
            let outputSchema
            if (!resTypeList.includes(responseValue.type)) throw new Error('output type mast ba array or object or number!')
            if (responseValue.type === 'array') {
              outputSchema = {
                type: 'array',
                items: responseValue.result ? jsonSchema.convert(responseValue.result) : { type: 'object', properties: {} }
              }
            }
            if (responseValue.type === 'object') {
              outputSchema = responseValue.result ? jsonSchema.convert(responseValue.result) : { type: 'object', properties: {} }
            }
            if (responseValue.type === 'number') {
              outputSchema = { type: 'object', properties: { result: { type: 'number', description: '返回标识' } } }
            }
            outputDatas[responseKey] = {
              description: 'response success',
              content: {
                'application/json': {
                  schema: outputSchema
                }
              }
            }
            return outputDatas
          }, Promise.resolve({}))
      }
      const swaggerItem = {}
      swaggerItem[schemaValue.path] = {}
      swaggerItem[schemaValue.path][schemaValue.method] = content
      methodRet.push(swaggerItem)
    }, Promise.resolve())
    return methodRet
  }, Promise.resolve([]))
  return {
    openapi: '3.0.0',
    info,
    paths: methods.reduce((acc, method) => _.merge(acc, method), {}),
    components
  }
}

module.exports = generateSwaggerDoc
