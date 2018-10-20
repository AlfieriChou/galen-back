const dirConfig = {
  logger: './common/logger',
  router: './routes/index.js'
}
for (let i in dirConfig) {
  exports[i] = require('./' + dirConfig[i])
}
