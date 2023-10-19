const fs = require('fs');
const readline = require('readline');
const config = require('./lib/configReader');
const logger = require('./lib/log');
const { processFile } = require('./lib/processFile');

const api = require('adamant-api')({ node: config.node_ADM, logLevel: 'info' });

const ADAMANT_ADDRESS_REGEXP = /^U([0-9]{6,21})$/;

const addresses = [];

const succAddresses = [];
const failAddresses = [];

async function main() {
  const { validAddresses, invalidAddresses } = await processFile(config.inputFile);

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

main();
