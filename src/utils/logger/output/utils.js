import { config } from '../../config/index.js'

import { createDirectory } from '../../dir.js'
import { fullDate } from '../../date.js'

export function createOutputDirectories() {
  const outputPath = `./${config.outputPath}/${fullDate()}`

  createDirectory(outputPath)

  return outputPath
}
