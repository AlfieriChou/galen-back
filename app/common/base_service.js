class BaseService {
  getSort (options) {
    const result = []
    options = options.split(',')
    options.map((item) => {
      const sortArray = []
      item.startsWith('-') || item.startsWith('+') ? sortArray.push(item.substring(1)) : sortArray.push(item)
      const sort = item.startsWith('-') ? 'desc' : 'asc'
      sortArray.push(sort)
      result.push(sortArray)
    })
    return result
  }
}

module.exports = BaseService
