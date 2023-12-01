import fs from 'fs'
import * as logger from '../index.js'

export function createWriteStream(filePath) {
  try {
    return fs.createWriteStream(filePath, { flags: 'a' })
  } catch (error) {
    logger.error(`Failed to create write stream for ${filePath}: ${error}`)
    return null
  }
}
