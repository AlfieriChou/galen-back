const Sequelize = require('sequelize')

class JsonSchema {
  property (attribute, options) {
    let type = attribute.type
    let comment = attribute.comment
    let addNull = attribute.allowNull && options.allowNull
    if (type instanceof Sequelize.ENUM) return { enum: attribute.values, description: attribute.comment }
    if (type instanceof Sequelize.BOOLEAN) return { type: addNull ? ['boolean', 'null'] : 'boolean', description: comment }
    if (type instanceof Sequelize.INTEGER) return { type: addNull ? ['integer', 'null'] : 'integer', format: 'int32', description: comment }
    if (type instanceof Sequelize.BIGINT) return { type: addNull ? ['integer', 'null'] : 'integer', format: 'int64', description: comment }
    if (type instanceof Sequelize.FLOAT ||
    type instanceof Sequelize.REAL) {
      return { type: addNull ? ['number', 'null'] : 'number', format: 'float', description: comment }
    }
    if (type instanceof Sequelize.DOUBLE) { return { type: addNull ? ['number', 'null'] : 'number', format: 'double', description: comment } }
    if (type instanceof Sequelize.DECIMAL) { return { type: addNull ? ['number', 'null'] : 'number', description: comment } }
    if (type instanceof Sequelize.DATEONLY) { return { type: addNull ? ['string', 'null'] : 'string', format: 'date', description: comment } }
    if (type instanceof Sequelize.DATE) { return { type: addNull ? ['string', 'null'] : 'string', format: 'date-time', description: comment } }
    if (type instanceof Sequelize.TIME) { return { type: addNull ? ['string', 'null'] : 'string', description: comment } }
    if (type instanceof Sequelize.UUID ||
    type instanceof Sequelize.UUIDV1 ||
    type instanceof Sequelize.UUIDV4) {
      return { type: addNull ? ['string', 'null'] : 'string', format: 'uuid', description: comment }
    }
    if (type instanceof Sequelize.CHAR ||
    type instanceof Sequelize.STRING ||
    type instanceof Sequelize.TEXT ||
    type instanceof Sequelize.UUID ||
    type instanceof Sequelize.DATE ||
    type instanceof Sequelize.DATEONLY ||
    type instanceof Sequelize.TIME) {
      const schema = { type: addNull ? ['string', 'null'] : 'string' }
      var maxLength = (type.options && type.options.length) || type._length
      if (type instanceof Sequelize.TEXT) {
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
    if (type instanceof Sequelize.JSON ||
    type instanceof Sequelize.JSONB) {
      return attribute.keys ? this.convert(attribute.keys) : { type: 'object', properties: {} }
    }
    if (type instanceof Sequelize.VIRTUAL) {
      return type.returnType ? this.property({ type: type.returnType, allowNull: type.allowNull, description: comment }, options) : addNull ? { type: ['string', 'null'], description: comment } : { type: 'string', description: comment }
    }
    if (type instanceof Sequelize.ARRAY) {
      return type.type ? { type: 'array', items: this.property({ type: type.type }) } : attribute.items ? { type: 'array', items: this.convert(attribute.items) } : { type: 'array', description: comment }
    }
    return { type: (attribute.type.key).toLowerCase(), description: comment }
  }
  transform (model, options) {
    options = options || {}
    const schema = {
      type: 'object',
      properties: {}
    }
    let exclude = options.exclude || options.private || []
    let attributes = options.attributes || Object.keys(model.rawAttributes)
    for (let attributeName of attributes) {
      if (exclude.indexOf(attributeName) >= 0) {
        continue
      }
      let attribute = model.rawAttributes[attributeName]
      if (attribute) {
        schema.properties[attributeName] = this.property(attribute, options)
        let field = schema.properties[attributeName]
        const associations = model.associations
        if (model.associations && !field.description) {
          for (let linkField in associations) {
            if (attributeName === associations[linkField].options.foreignKey) {
              field.description = associations[linkField].options.comment
            }
          }
        }
      }
    }
    return schema
  }
  convert (model, options) {
    options = options || {}
    const schema = {
      type: 'object',
      properties: {}
    }
    let exclude = options.exclude || options.private || []
    let attributes = Object.keys(model)
    for (let attributeName of attributes) {
      if (exclude.indexOf(attributeName) >= 0) {
        continue
      }
      let attribute = model[attributeName]
      if (attribute) {
        schema.properties[attributeName] = this.property(attribute, options)
      }
    }
    return schema
  }
}

module.exports = new JsonSchema()
