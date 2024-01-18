import { shouldSetup } from './args.js'

const action = shouldSetup ? 'setup' : 'airdrop'

const { default: run } = await import(`./commands/${action}.js`)

run()
