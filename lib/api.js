const config = require('./configReader');
const logger = require('./log');

const api = require('adamant-api')({ node: config.node_ADM, logLevel: 'info' });

async function sendTokens(addresses) {
  const successfulAddresses = [];
  const failedAddresses = [];

  for (const address of addresses) {
    try {
      const response = await api.sendTokens(config.passPhrase, address, config.amount);

      if (response.success) {
        successfulAddresses.push(address);
        logger.log(`Successfuly sent tokens to ${address}`);
      } else {
        failedAddresses.push(address);
        logger.warn(`Failed to send tokens to ${address}`);
      }

      return { successfulAddresses, failedAddresses };
    } catch (error) {
      failedAddresses.push(address);
      logger.error(`Failed to send tokens to address ${address}: ${error}`);
    }
  }
}

async function getBalance(address) {
  try {
    const response = await api.get('accounts/getBalance', { address });
    console.log(response);

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
