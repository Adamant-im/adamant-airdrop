const logger = require('./log');
const { processFile } = require('./processFile');
const { getBalance } = require('./api');
const { serialize } = require('./output');

const { TRANSACTION_FEE } = require('../constants');

/**
 * Validate input file and account balance
 * @param {String} inputFileName file to read addresses from
 * @param {String} address account address to send tokens from
 * @param {Number} amount amount of tokens to send
 * @returns {Promise<Object>}
 */
async function validate(inputFileName, address, amount) {
  const { validAddresses, invalidAddresses } = await processFile(inputFileName);

  logger.log(`Processed input file: ${inputFileName}`);
  logger.log(`Valid addresses: ${validAddresses.length}`);
  if (invalidAddresses.length) {
    logger.warn(`Invalid addresses: ${invalidAddresses.length}`);
  } else {
    logger.log(`Invalid addresses: ${invalidAddresses.length}`);
  }

  serialize(validAddresses.join(`\n`), 'validAddresses');
  serialize(invalidAddresses.join(`\n`), 'invalidAddresses');

  const balance = await getBalance(address);
  if (!balance) {
    logger.error(`Failed to verify ${address} balance`);
    process.exit(1);
  } else if (balance < validAddresses.length * (amount + TRANSACTION_FEE)) {
    logger.error(`${address} account doesn't have enough ADM to execute all airdrop transactions: ${balance}`);
    process.exit(0);
  } else {
    logger.log(`Successfully verified ${address} balance: ${balance}`);
  }

  return { validAddresses };
}

module.exports = {
  validate,
};
