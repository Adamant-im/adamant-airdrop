import { config } from '../../utils/config/index.js'
import { fatalWithLog } from '../../utils/logger/index.js'

import { AddressesValidator } from './validator.js'
import { readAddresses } from './reader.js'

export const validateAddresses = async progress => {
  progress.set('Reading and validating addresses...')

  const validator = new AddressesValidator(progress, config)

  progress.log(`Searching for addresses in '${config.inputFile}' file`)

  for await (const [address, loc] of readAddresses(config.inputFile)) {
    validator.findAndSaveAddress(address, loc)
  }

  const addresses = [...validator.addresses]

  if (addresses.length === 0) {
    fatalWithLog('No valid addresses have been found.')
  }

  progress.done(`Successfully read and validated ${addresses.length} addresses`)

  return addresses
}
