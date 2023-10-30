const config = require('./configReader');
const logger = require('./log');

const api = require('adamant-api')({ node: config.node_ADM, logLevel: 'info' });

/**
 * Send tokens to addresses
 * @param {String[]} address 
 * @param {String} passPhrase 
 * @param {Number} amount 
 * @returns {Promise<Object>}
 */
async function sendTokens(address, passPhrase, amount) {
  try {
    const response = await api.sendTokens(passPhrase, address, amount);

    if (response.success) {
      return {
        address,
        txId: response.data.transactionId,
        amount,
      };
    } else {
      logger.error(`Failed to send tokens to address ${address}`);
      return undefined;
    }
  } catch (error) {
    logger.error(`Failed to send tokens to address ${address}: ${error}`);
    return undefined;
  }
}

/**
 * Get balances by address
 * @param {String} address
 * @returns {Promise<Number|undefined>}
 */
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
