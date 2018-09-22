const transform = require('./transform').transform
const Validator = require('jsonschema').Validator
const v = new Validator()

class BaseController {
  async validate (schema, model, json, options) {
    const jsonSchema = transform(schema)
    const required = model.requestBody.required
    jsonSchema.required = required
    const result = await v.validate(json, jsonSchema)
    return new Promise((resolve, reject) => {
      if (result.errors[0]) {
        const err = result.errors[0].message
        reject(err)
      } else {
        resolve(result)
      }
    })
  }
}

module.exports = BaseController
