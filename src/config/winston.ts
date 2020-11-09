import { formatDate } from 'helpers/Date'
import path from 'path'
import winston from 'winston'

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: `${path.resolve('./logs')}/log-${formatDate(new Date())}.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
}

// instantiate a new Winston Logger with the settings defined above
const winstonLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
})

// create a stream object with a 'write' function that will be used by `morgan`
export const winstonStream = {
  write: (message: string) => {
    winstonLogger.info(message)
  },
}
