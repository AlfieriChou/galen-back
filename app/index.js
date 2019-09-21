const exportDirConfig = {
  logger: './common/logger.js',
  router: './routes/index.js'
}
for (const i in exportDirConfig) {
  exports[i] = require(`./${exportDirConfig[i]}`)
}
