import { fatal } from './utils/fatal.js'

const args = process.argv.slice(2)

if (args.length > 2) {
  fatal('Expected 2 arguments or less')
}

let configPath = ''
let validateOnlyFlag = false
let shouldSetup = false

for (const arg of args) {
  if (arg === '--validate') {
    validateOnlyFlag = true
  } else if (arg === 'setup') {
    shouldSetup = true
  } else {
    configPath = arg
  }
}

// `--validate` flag can't be used without a config path
// and `setup` command doesn't accept any arguments
if (args.length === 2 && (!validateOnlyFlag || shouldSetup)) {
  fatal('Invalid second argument')
}

export { configPath, validateOnlyFlag, shouldSetup }
