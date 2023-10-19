const fs = require('fs');
const readline = require('readline');
const config = require('./lib/configReader');
const logger = require('./lib/log');

const api = require('adamant-api')({ node: config.node_ADM, logLevel: 'info' });

const ADAMANT_ADDRESS_REGEXP = /^U([0-9]{6,21})$/;

const addresses = [];
const invalidAddresses = [];

const succAddresses = [];
const failAddresses = [];

async function main() {
  await processLineByLine();

  for (const address of addresses) {
    const response = await api.sendTokens(config.passPhrase, address, config.amount);
    console.log(address, response.status)

    if (response.success) {
      succAddresses.push(address);
    } else {
      failAddresses.push(address);
    }
  }

  logger.error(`Failed to send tokens to  ${failAddresses.length} addresses`, 'failAddress', failAddresses);
  logger.info(`Succeeded to send tokens to ${succAddresses.length} addresses`, 'succAddress', succAddresses);
}

async function processLineByLine() {
  const fileStream = fs.createReadStream(config.inputFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (ADAMANT_ADDRESS_REGEXP.test(line)) {
      addresses.push(line);
    } else {
      logger.error(`Failed to validate address: ${line}`);
      invalidAddresses.push(line);
    }
  }

  logger.error(`Failed to validate ${invalidAddresses.length} addresses`, 'invalidAddress', invalidAddresses);
  logger.info(`Succeeded to validate ${addresses.length} addresses`, 'validAddress', addresses);
}

main();
