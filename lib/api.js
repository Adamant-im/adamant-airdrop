const config = require('./configReader');
const logger = require('./log');

const api = require('adamant-api')({ node: config.node_ADM, logLevel: 'info' });

async function sendTokens(addresses) {
  const successfulTxs = [];
  const failedAddresses = [];

  for (const address of addresses) {
    try {
      const response = await api.sendTokens(config.passPhrase, address, config.amount);

      if (response.success) {
        successfulTxs.push({
          address,
          txId: response.data.transactionId,
        });
        logger.log(`Successfuly sent tokens to ${address}. TX: ${response.data.transactionId}`);
      } else {
        failedAddresses.push(address);
        logger.warn(`Failed to send tokens to ${address}`);
      }
    } catch (error) {
      failedAddresses.push(address);
      logger.error(`Failed to send tokens to address ${address}: ${error}`);
    }
  }

  return { successfulTxs, failedAddresses };
}

async function getBalance(address) {
  try {
    const response = await api.get('accounts/getBalance', { address });

    if (response.success) {
      return +response.data.balance / 10 ** 8;
    } else {
      return undefined;
    }
  } catch (error) {
    logger.error(`Unable to get balance for address: ${address}. ${error}`);
    return undefined;
  }
}

module.exports = {
  sendTokens,
  getBalance,
};
