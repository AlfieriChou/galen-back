class BaseService {
  getSort (options) {
    let result = []
    options = options.split(',')
    options.map(item => {
      let sortArray = []
      item.startsWith('-') || item.startsWith('+') ? sortArray.push(item.substring(1)) : sortArray.push(item)
      let sort = item.startsWith('-') ? 'desc' : 'asc'
      sortArray.push(sort)
      result.push(sortArray)
    })
    return result
  }
}

module.exports = BaseService
