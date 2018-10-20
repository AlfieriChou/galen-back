const dirConfig = {
  logger: './common/logger'
}
for (let i in dirConfig) {
  exports[i] = require('./' + dirConfig[i])
}
