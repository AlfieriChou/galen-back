const _ = require('lodash')

const camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v))
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj)
      .reduce((result, key) => ({
        ...result,
        [_.camelCase(key)]: camelizeKeys(obj[key])
      }), {})
  }
  return obj
}

module.exports = camelizeKeys
