const winston = require('winston')
require('winston-daily-rotate-file')

const transport = new (winston.transports.DailyRotateFile)({
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '100m',
  maxFiles: '30d'
})

const logger = new (winston.Logger)({
  transports: [
    transport
  ]
})

module.exports = logger
