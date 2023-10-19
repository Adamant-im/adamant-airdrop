const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const config = require('./lib/configReader');
const logger = require('./lib/log');
const { processFile } = require('./lib/processFile');
const { sendTokens } = require('./lib/sendTokens');

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

  //const { successfulAddresses, failedAddresses } = await sendTokens(validAddresses);
}

main();
