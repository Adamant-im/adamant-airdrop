import fs from 'fs'
import { date, fullTime } from '../utils/date.js'
import { maxLogLevelLength } from './const.js'

const logsDirPath = './logs'

if (!fs.existsSync(logsDirPath)) {
  fs.mkdirSync(logsDirPath)
}

const logFileName = `${logsDirPath}/${date()}.log`
const logStream = fs.createWriteStream(logFileName, { flags: 'a' })

logStream.write(
  `\n\n[The app has been started] _________________${fullTime()}_________________\n`
)

export function writeLog(level, message) {
  const gap = ' '.repeat(maxLogLevelLength - level.length)
  logStream.write(`\n${level + gap}|${fullTime()}| ${message}`)
}
