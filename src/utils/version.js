import fs from 'fs/promises'
import { join } from 'path'

import { __dirname } from './dir.js'

export const { version } = JSON.parse(
  await fs.readFile(join(__dirname, '../../package.json'), 'utf-8')
)
