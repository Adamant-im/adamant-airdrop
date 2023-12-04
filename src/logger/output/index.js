import * as logger from '../index.js'

import { createOutputDirectories } from './utils.js'
import { createWriteStream } from './stream.js'

const outputPath = createOutputDirectories()

const streams = {
  successfulAddresses: createWriteStream(
    `${outputPath}/successfulTransactions.csv`,
    ['address', 'transaction_id', 'amount', 'timestamp']
  ),
  failedAddresses: createWriteStream(`${outputPath}/failedTransactions.csv`, [
    'address'
  ])
}

export function serialize(data, streamName) {
  try {
    const stream = streams[streamName]

    if (stream) {
      const line = typeof data === 'string' ? data : data.join(', ')

      stream.write(`${line}\n`)
    }
  } catch (error) {
    logger.error(`Failed to serialize data to ${streamName}.csv: ${error}`)
  }
}
