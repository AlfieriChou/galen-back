const exportDirConfig = {
  router: './routes/index.js'
}
for (let i in exportDirConfig) {
  exports[i] = require('./' + exportDirConfig[i])
}
