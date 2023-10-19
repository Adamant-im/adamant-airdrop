const fs = require('fs');
const readline = require('readline');
const config = require("./configReader");

const ADAMANT_ADDRESS_REGEXP = /^U([0-9]{6,21})$/;

async function processFileTxt() {
  try {
    const fileStream = fs.createReadStream(config.inputFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const validAddresses = [];
    const invalidAddresses = [];

    for await (const line of rl) {
      if (ADAMANT_ADDRESS_REGEXP.test(line)) {
        validAddresses.push(line);
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
  if (fileName.includes('.txt')) {
    return processFileTxt(fileName);
  }
}

module.exports = {
  processFile,
};
