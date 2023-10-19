const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const config = require('./lib/configReader');
const { processFile } = require('./lib/processFile');
const { sendTokens } = require('./lib/sendTokens');

async function main() {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(`Start airdrop? (type 'yes' to start): \n`);

  if (answer !== 'yes') {
    process.exit(1);
  }

  const { validAddresses, invalidAddresses } = await processFile(config.inputFile);

  const { successfulAddresses, failedAddresses } = await sendTokens(validAddresses);
}

main();
