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
      } else {
        failedAddresses.push(address);
      }

      return { successfulAddresses, failedAddresses };
    } catch (error) {
      failedAddresses.push(address);
      logger.error(`Failed to send tokens to address ${address}: ${error}`);
    }
  }
}

module.exports = {
  sendTokens,
};
