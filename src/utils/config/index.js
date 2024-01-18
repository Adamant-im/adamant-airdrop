import fs from 'fs/promises'
import path from 'path'

import jsonminify from 'jsonminify'

import {
  createKeypairFromPassphrase,
  createAddressFromPublicKey
} from 'adamant-api'

import { configPath } from '../../args.js'

import { fromZodError } from '../zod.js'
import { fatal } from '../fatal.js'
import { getLogLevel } from '../logger/const.js'

import { schema } from './schema.js'

// todo: replace with adamant-api@2.2.0's util function
const isPassphrase = passphrase =>
  typeof passphrase === 'string' && passphrase.length > 30

const supportedExtensions = ['.jsonc', '.json', '.csv', '.txt']

const readConfig = async pathToConfig => {
  if (!pathToConfig) {
    fatal(
      'No configuration file path was provided.\n' +
        'Please provide the path to the config file using the following syntax:\n' +
        '  npx adamant-airdrop ./config.json'
    )
  }

  const extension = path.extname(pathToConfig)

  if (!supportedExtensions.includes(extension)) {
    fatal(
      `The extension '${extension}' is not supported.\n` +
        `List of supported extensions: ${supportedExtensions.join(', ')}`
    )
  }

  try {
    return await fs.readFile(pathToConfig, 'utf-8')
  } catch (error) {
    const errorMessages = {
      EACCES: 'Permission denied',
      ENOENT: 'No such file',
      EISDIR: 'Expected a file, but the given path is a directory'
    }

    const errorMessage = errorMessages[error.code] || String(error)

    fatal(`Unable to read config file '${pathToConfig}': ${errorMessage}.`)
  }
}

const parseJSONC = jsonc => {
  try {
    return JSON.parse(jsonminify(jsonc))
  } catch (error) {
    fatal(`Unable to parse the config file '${configPath}':\n${error}`)
  }
}

const validateConfig = config => {
  const result = schema.safeParse(config)

  if (!result.success) {
    const message = fromZodError(result.error)

    fatal(`The given config is wrong format:\n  ${message}`)
  }

  if (!isPassphrase(config.passphrase)) {
    fatal('The given config is wrong. Invalid passphrase.')
  }

  try {
    const keyPair = createKeypairFromPassphrase(config.passphrase)
    const address = createAddressFromPublicKey(keyPair.publicKey)

    config.address = address
  } catch (error) {
    exit(`The given config is wrong. Invalid passphrase. Error: ${error}`)
  }

  config.logLevel = getLogLevel(config.logLevel)
}

const config = parseJSONC(await readConfig(configPath))

validateConfig(config)

export { config }
