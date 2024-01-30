import { config } from '../config/index.js'
import { fatal } from '../fatal.js'

import { writeLog } from './logging.js'
import { LogLevel, logLevelNames } from './const.js'

const logLevel = (level, message) => {
  if (config.logLevel >= level) {
    writeLog(logLevelNames[level], message)
  }
}

export const fatalWithLog = msg => {
  if (config.logLevel) {
    writeLog('fatal', msg)
  }

  fatal(msg)
}

export const error = msg => logLevel(LogLevel.Error, msg)
export const warn = msg => logLevel(LogLevel.Warn, msg)
export const info = msg => logLevel(LogLevel.Info, msg)
export const log = msg => logLevel(LogLevel.Log, msg)
