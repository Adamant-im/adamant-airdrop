const logger = require('./log');
const { sendTokens } = require('./api');
const { serializeToTxt } = require('./output');

async function airdrop(validAddresses) {
  const { successfulTxs, failedAddresses } = await sendTokens(validAddresses);

  logger.log('Token sending finished');
  logger.log(`Successful addresses: ${successfulTxs.length}`);
  logger.warn(`Failed addresses: ${failedAddresses.length}`);

  let successfulTxsString = '';
  for (const tx of successfulTxs) {
    successfulTxsString += `${tx.address} - ${tx.txId}\n`;
  }
  serializeToTxt(successfulTxsString, 'successfulAddresses');
  serializeToTxt(failedAddresses.join('\n'), 'failedAddresses');

  logger.log('Check airdrop results at ./output dir');
}

module.exports = {
  airdrop,
};
