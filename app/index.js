const exportDirConfig = {
  logger: './common/logger',
  router: './routes/index.js'
}
for (let i in exportDirConfig) {
  exports[i] = require('./' + exportDirConfig[i])
}
