const exportDirConfig = {
  logger: './common/logger.js',
  router: './routes/index.js'
}

/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
Object.entries(exportDirConfig).forEach(([key, value]) => {
  exports[key] = require(`${value}`)
})
/* eslint-enable global-require */
/* eslint-enable import/no-dynamic-require */
