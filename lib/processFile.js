const fs = require('fs');
const readline = require('readline');
const logger = require('./log');
const config = require('./configReader');

const ADAMANT_ADDRESS_REGEXP = /U[0-9]{6,21}/;

async function processFileTxt(fileName) {
  try {
    const fileStream = fs.createReadStream(fileName);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const validAddresses = [];
    const invalidAddresses = [];

    for await (const line of rl) {
      const address = line.match(ADAMANT_ADDRESS_REGEXP)?.[0];
      if (address) {
        if (config.skipDublicates && validAddresses.includes(address)) {
          logger.warn(`Skipping dublicate: ${address}`);
        } else {
          validAddresses.push(address);
        }
      } else {
        invalidAddresses.push(line);
        logger.error(`Failed to validate address: ${line}`);
      }
    }

    return { validAddresses, invalidAddresses };
  } catch (error) {
    logger.error(`Failed to process file: ${error}`);
    process.exit(1);
  }
}

function processFile(fileName) {
  if (fileName.includes('.txt') || fileName.includes('.csv')) {
    return processFileTxt(fileName);
  }
}

module.exports = {
  processFile,
};
