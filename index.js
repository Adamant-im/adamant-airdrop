const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const config = require('./lib/configReader');
const logger = require('./lib/log');
const { processFile } = require('./lib/processFile');
const { sendTokens, getBalance } = require('./lib/api');
const { serializeToTxt } = require('./lib/output');

const TRANSACTION_FEE = 0.5;

async function main() {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(`ATTENTION! \nStart airdrop? \nPlease, check your config once again \nType 'yes' to start: \n`);

  if (answer !== 'yes') {
    process.exit(1);
  }

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

  const { successfulAddresses, failedAddresses } = await sendTokens(validAddresses);

  logger.log('Token sending finished');
  logger.log(`Successful addresses: ${successfulAddresses.length}`);
  logger.warn(`Failed addresses: ${failedAddresses.length}`);

  logger.log('Check airdrop results at ./output dir');

  process.exit(1);
}

main();
