import * as logger from '../index.js'

import { createOutputDirectories } from './utils.js'
import { createWriteStream } from './stream.js'

const outputPath = createOutputDirectories()

const streams = {
  successfulAddresses: createWriteStream(
    `${outputPath}/successfulTransactions.csv`
  ),
  failedAddresses: createWriteStream(`${outputPath}/failedTransactions.csv`)
}

export function serialize(data, streamName) {
  try {
    if (streams[streamName]) {
      const line = typeof data === 'string' ? data : data.join(', ')

      streams[streamName].write(`${line}\n`)
    }
  } catch (error) {
    logger.error(`Failed to serialize data to ${streamName}.csv: ${error}`)
  }
}
