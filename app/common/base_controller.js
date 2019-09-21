const { convert } = require('./transform')
const { Validator } = require('jsonschema')

const v = new Validator()

class BaseController {
  async validate (model, params) {
    const jsonSchema = convert(model.requestBody.body)
    const { required } = model.requestBody
    jsonSchema.required = required
    const result = await v.validate(params, jsonSchema)
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
