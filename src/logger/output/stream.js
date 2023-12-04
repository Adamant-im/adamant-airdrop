import fs from 'fs'
import * as logger from '../index.js'

export function createWriteStream(filePath, headers) {
  try {
    const stream = fs.createWriteStream(filePath, { flags: 'a' })

    stream.write(`${headers.join(', ')}\n`)

    return stream
  } catch (error) {
    logger.error(`Failed to create write stream for ${filePath}: ${error}`)
    return null
  }
}
