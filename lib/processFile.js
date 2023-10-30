const fs = require('fs');
const readline = require('readline');
const logger = require('./log');
const config = require('./configReader');

const { ADAMANT_ADDRESS_REGEXP } = require('../constants');

/**
 * Process .txt or .csv file
 * @param {String} fileName 
 * @return {Promise<Object>}
 */
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
    logger.error(`Failed to process file ${fileName}: ${error}`);
    process.exit(1);
  }
}

/**
 * Process .json file
 * @param {String} fileName
 * @return {Object}
 */
function processsFileJson(fileName) {
  try {
    const fileData = fs.readFileSync(fileName);
    const data = JSON.parse(fileData);

    const validAddresses = [];
    const invalidAddresses = [];

    for (const el of data.list) {
      const address = el.match(ADAMANT_ADDRESS_REGEXP)?.[0];

      if (address) {
        if (config.skipDublicates && validAddresses.includes(address)) {
          logger.warn(`Skipping dublicate: ${address}`);
        } else {
          validAddresses.push(address);
        }
      } else {
        invalidAddresses.push(el);
        logger.error(`Failed to validate address: ${el}`);
      }
    }
    
    return { validAddresses, invalidAddresses };
  } catch (error) {
    logger.error(`Failed to process file ${fileName}: ${error}`);
    process.exit(1);
  }
}

/**
 * Process file
 * @param {String} fileName 
 * @return {Promise<Object>|Object}
 */
function processFile(fileName) {
  if (fileName.includes('.txt') || fileName.includes('.csv')) {
    return processFileTxt(fileName);
  } else if (fileName.includes('.json')) {
    return processsFileJson(fileName);
  }
}

module.exports = {
  processFile,
};
