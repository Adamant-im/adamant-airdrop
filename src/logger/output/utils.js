import fs from 'fs'
import { config } from '../../config/index.js'
import { fullDate } from '../../utils/date.js'

export function createOutputDirectories() {
  const outputPath = `./${config.outputPath}/${fullDate()}`

  createDirectory(`${outputPath}`)

  return outputPath
}

function createDirectory(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}
