const config = require('./configReader');
const logger = require('./log');
const { processFile } = require('./processFile');
const {  getBalance } = require('./api');
const { serializeToTxt } = require('./output');

const { TRANSACTION_FEE } = require('../constants');

async function validate() {
  const { validAddresses, invalidAddresses } = await processFile(config.inputFile);

  logger.log(`Successfully processed input file`);
  logger.log(`Valid addresses: ${validAddresses.length}`);
  logger.warn(`Invalid addresses: ${invalidAddresses.length}`);

  serializeToTxt(validAddresses.join(`\n`), 'validAddresses');
  serializeToTxt(invalidAddresses.join(`\n`), 'invalidAddresses');

  const balance = await getBalance(config.address);
  if (!balance) {
    logger.error(`Unable to verify ${config.address} balance`);
    process.exit(1);
  } else if (balance < validAddresses.length * (config.amount + TRANSACTION_FEE)) {
    logger.error(`${config.address} doen't have enough ADM to execute all airdrop transactions`);
    process.exit(0);
  } else {
    logger.log(`Successfully verified ${config.address} balance`);
  }

  return { validAddresses };
}

module.exports = {
  validate,
};
