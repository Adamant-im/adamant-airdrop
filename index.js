const config = require('./lib/configReader');
const { processFile } = require('./lib/processFile');
const { sendTokens } = require('./lib/sendTokens');

async function main() {
  const { validAddresses, invalidAddresses } = await processFile(config.inputFile);

  const { successfulAddresses, failedAddresses } = await sendTokens(validAddresses);
}

main();
