const Sequelize = require('sequelize')

const property = (attribute, options) => {
  const { type } = attribute
  const { comment } = attribute
  const addNull = attribute.allowNull && options.allowNull
  if (type instanceof Sequelize.ENUM) {
    return {
      enum: attribute.values,
      description: attribute.comment
    }
  }
  if (type instanceof Sequelize.BOOLEAN) {
    return {
      type: addNull ? ['boolean', 'null'] : 'boolean',
      description: comment
    }
  }
  if (type instanceof Sequelize.INTEGER) {
    return {
      type: addNull ? ['integer', 'null'] : 'integer',
      format: 'int32',
      description: comment
    }
  }
  if (type instanceof Sequelize.BIGINT) {
    return {
      type: addNull ? ['integer', 'null'] : 'integer',
      format: 'int64',
      description: comment
    }
  }
  if (type instanceof Sequelize.FLOAT ||
    type instanceof Sequelize.REAL) {
    return {
      type: addNull ? ['number', 'null'] : 'number',
      format: 'float',
      description: comment
    }
  }
  if (type instanceof Sequelize.DOUBLE) {
    return {
      type: addNull ? ['number', 'null'] : 'number',
      format: 'double',
      description: comment
    }
  }
  if (type instanceof Sequelize.DECIMAL) {
    return {
      type: addNull ? ['number', 'null'] : 'number',
      description: comment
    }
  }
  if (type instanceof Sequelize.DATEONLY) {
    return {
      type: addNull ? ['string', 'null'] : 'string',
      format: 'date',
      description: comment
    }
  }
  if (type instanceof Sequelize.DATE) {
    return {
      type: addNull ? ['string', 'null'] : 'string',
      format: 'date-time',
      description: comment
    }
  }
  if (type instanceof Sequelize.TIME) {
    return {
      type: addNull ? ['string', 'null'] : 'string',
      description: comment
    }
  }
  if (type instanceof Sequelize.UUID ||
    type instanceof Sequelize.UUIDV1 ||
    type instanceof Sequelize.UUIDV4) {
    return {
      type: addNull ? ['string', 'null'] : 'string',
      format: 'uuid',
      description: comment
    }
  }
  if (type instanceof Sequelize.CHAR ||
    type instanceof Sequelize.STRING ||
    type instanceof Sequelize.TEXT ||
    type instanceof Sequelize.UUID ||
    type instanceof Sequelize.DATE ||
    type instanceof Sequelize.DATEONLY ||
    type instanceof Sequelize.TIME) {
    const schema = { type: addNull ? ['string', 'null'] : 'string' }
    // eslint-disable-next-line no-underscore-dangle
    let maxLength = (type.options && type.options.length) || type._length
    if (type instanceof Sequelize.TEXT) {
      // eslint-disable-next-line default-case
      switch (maxLength) {
        case 'tiny': maxLength = 255
          break
        case 'medium': maxLength = 16777215
          break
        case 'long': maxLength = 4294967295
          break
      }
    }
    if (maxLength) schema.maxLength = maxLength
    schema.description = comment
    return schema
  }
  if (type instanceof Sequelize.VIRTUAL) {
    // eslint-disable-next-line no-nested-ternary
    return type.returnType ? property({
      type: type.returnType,
      allowNull: type.allowNull,
      description: comment
    }, options) : addNull ? {
      type: ['string', 'null'],
      description: comment
    } : {
      type: 'string',
      description: comment
    }
  }
  if (attribute.type.key === 'JSON') {
    return attribute.keys
      ? { ...convert(attribute.keys), description: comment }
      : { type: 'object', properties: {}, description: comment }
  }
  if (attribute.type.key === 'ARRAY') {
    return {
      type: 'array',
      items: attribute.items ? property(attribute.items) : {},
      description: comment
    }
  }
  return { type: (attribute.type.key).toLowerCase(), description: comment }
}

const transform = (model, option) => {
  const options = option || {}
  const exclude = options.exclude || options.private || []
  const attributes = options.attributes || Object.keys(model.rawAttributes)
  return {
    type: 'object',
    properties: attributes.reduce((ret, attribute) => {
      if (exclude.includes(attribute)) {
        return ret
      }
      const attributeValue = model.rawAttributes[attribute]
      if (attributeValue) {
        const field = property(attributeValue, options)
        if (model.associations && !field.description) {
          const { associations } = model
          Object.entries(associations).forEach(([, association]) => {
            if (attribute === association.options.foreignKey) {
              field.description = association.options.comment
            }
          })
        }
        // eslint-disable-next-line no-param-reassign
        ret[attribute] = field
      }
      return ret
    }, {})
  }
}

const convert = (model, option) => {
  const options = option || {}
  const exclude = options.exclude || options.private || []
  return {
    type: 'object',
    properties: Object.entries(model).reduce((ret, [key, value]) => {
      if (exclude.includes(key)) {
        return ret
      }
      if (value) {
        // eslint-disable-next-line no-param-reassign
        ret[key] = property(value, options)
      }
      return ret
    }, {})
  }
}

module.exports = {
  transform,
  convert
}
