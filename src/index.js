#!/usr/bin/env node

import { action } from './args.js'

const { default: run } = await import(`./commands/${action}.js`)

run()
