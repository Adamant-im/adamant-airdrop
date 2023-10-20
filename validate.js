const config = require('./lib/configReader');
const logger = require('./lib/log');
const { processFile } = require('./lib/processFile');
const { getBalance } = require('./lib/api');
const { serializeToTxt } = require('./lib/output');

const TRANSACTION_FEE = 0.5;

async function main() {
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
    process.exit(1);
  } else {
    logger.log(`Successfully verified ${config.address} balance`);
  }

  logger.log('Check valid and invalid addresses at ./output dir');
}

main();
