const exportDirConfig = {
  logger: './common/logger.js',
  router: './routes/index.js'
}
for (let i in exportDirConfig) {
  exports[i] = require('./' + exportDirConfig[i])
}
