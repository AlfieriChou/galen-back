const logger = require('./logger')
const db = require('../model')

const getSort = (options) => {
  const orders = options.split(',')
  return orders.reduce((result, item) => {
    const sortArray = []
    item.startsWith('-') || item.startsWith('+') ? sortArray.push(item.substring(1)) : sortArray.push(item)
    const sort = item.startsWith('-') ? 'desc' : 'asc'
    sortArray.push(sort)
    result.push(sortArray)
    return result
  }, [])
}

class BaseService {
  constructor () {
    this.getSort = getSort
    this.logger = logger
  }

  // eslint-disable-next-line class-methods-use-this
  get db () {
    return db
  }
}

module.exports = BaseService
