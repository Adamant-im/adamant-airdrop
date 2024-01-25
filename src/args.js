import { fatal } from './utils/fatal.js'

const args = process.argv.slice(2)

if (args.length > 2) {
  fatal('Expected 2 arguments or less')
}

let configPath = ''
let action = 'airdrop'

let validateOnlyFlag = false

for (const arg of args) {
  switch (arg) {
    case '--validate':
      validateOnlyFlag = true
      break

    case 'setup':
      action = 'setup'
      break

    case '--version':
    case '-v':
      action = 'version'
      break

    default:
      configPath = arg
      break
  }
}

// `--validate` flag can't be used without a config path
// and `setup` command doesn't accept any arguments
if (args.length === 2 && (!validateOnlyFlag || action === 'setup')) {
  fatal('Invalid second argument')
}

export { configPath, validateOnlyFlag, action }
