import fs from 'fs'
import { date, fullTime } from '../date.js'
import { maxLogLevelLength } from './const.js'

const logsDirPath = './logs'

if (!fs.existsSync(logsDirPath)) {
  fs.mkdirSync(logsDirPath)
}

const logFileName = `${logsDirPath}/${date()}.log`
const logStream = fs.createWriteStream(logFileName, { flags: 'a' })

logStream.write(
  `[The app has been started] _________________${fullTime()}_________________\n`
)

export function writeLog(level, message) {
  const gap = ' '.repeat(maxLogLevelLength - level.length)
  logStream.write(`${level + gap}|${fullTime()}| ${message}\n`)
}
