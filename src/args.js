import { fatal } from './utils/fatal.js'

const args = process.argv.slice(2)

if (args.length > 2) {
  fatal('Expected 2 arguments or less')
}

let configPath = ''
let validateOnlyFlag = false

for (const arg of args) {
  if (arg === '--validate') {
    validateOnlyFlag = true
  } else {
    configPath = arg
  }
}

if (args.length === 2 && !validateOnlyFlag) {
  fatal('Invalid second argument')
}

export { configPath, validateOnlyFlag }
