const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const fs = require('fs')

const env = process.env.NODE_ENV || 'development'
const logDir = 'logs'
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-app.log`,
  datePattern: 'YYYY-MM-DD'
})

const logger = createLogger({
  level: env === 'development' ? 'verbose' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
  ]
})

module.exports = logger
