import { config } from '../config/index.js'

import { AddressesValidator } from './validator.js'
import { readAddresses } from './reader.js'
import { fatal } from '../logger/index.js'

export const validateAddresses = async progress => {
  progress.set('Reading and validating addresses...')

  const validator = new AddressesValidator(progress, config)

  progress.log(`Searching for addresses in '${config.inputFile}' file`)

  for await (const [address, loc] of readAddresses(config.inputFile)) {
    validator.findAndSaveAddress(address, loc)
  }

  const addresses = [...validator.addresses]

  if (addresses.length === 0) {
    fatal('No valid addresses found.')
  }

  progress.done(`Successfuly read and validated addresses`)

  return addresses
}
