const logger = require('./log');
const { sendTokens } = require('./api');
const { serialize } = require('./output');

/**
 * Run airdrop
 * @param {String[]} addresses 
 * @param {String} passPhrase 
 * @param {Number} amount 
 */
async function airdrop(addresses, passPhrase, amount) {
  const successfulTxs = [];
  const failedAddresses = [];

  for (const address of addresses) {
    const response = await sendTokens(address, passPhrase, amount);

    if (response) {
      successfulTxs.push(response);
      serialize(`${response.address} - ${response.txId} - ${response.amount} - ${Date.now()}\n`, 'successfulAddresses');
      logger.log(`Successfuly sent tokens to ${address}. TX: ${response.txId}`);
    } else {
      failedAddresses.push(address);
      serialize(address, 'failedAddresses');
      logger.warn(`Failed to send tokens to ${address}`);
    }
  }

  logger.log('Token sending finished');
  logger.log(`Successful addresses: ${successfulTxs.length}`);
  if (failedAddresses.length) {
    logger.warn(`Failed addresses: ${failedAddresses.length}`);
  } else {
    logger.log(`Failed addresses: ${failedAddresses.length}`);
  }

  logger.log('Check airdrop results at ./output dir');
}

module.exports = {
  airdrop,
};
