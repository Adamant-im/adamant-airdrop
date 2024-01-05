import fs from 'fs'
import { config } from '../../config/index.js'
import { fullTime } from '../../utils/date.js'

export function createOutputDirectories() {
  const outputPath = `./${config.outputPath}/${fullTime()}`

  createDirectory(`${outputPath}`)

  return outputPath
}

function createDirectory(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}
