const fs = require('fs');
const logger = require('./log');
const dateTime = require('./dateTime');

if (!fs.existsSync('./output')) {
  fs.mkdirSync('./output');
}

const outputDirName = dateTime.fullTime();

fs.mkdirSync(`./output/${outputDirName}`);
fs.mkdirSync(`./output/${outputDirName}/txt`);
fs.mkdirSync(`./output/${outputDirName}/txt/validate`);
fs.mkdirSync(`./output/${outputDirName}/txt/airdrop`);

const validAddressesStream = fs.createWriteStream(`./output/${outputDirName}/txt/validate/validAddresses.txt`, {
  flags: 'a',
});

const invalidAddressesStream = fs.createWriteStream(`./output/${outputDirName}/txt/validate/invalidAddresses.txt`, {
  flags: 'a',
});

const successfulAddressesStream = fs.createWriteStream(`./output/${outputDirName}/txt/airdrop/successfulAddresses.txt`, {
  flags: 'a',
});

const failedAddressesStream = fs.createWriteStream(`./output/${outputDirName}/txt/airdrop/failedAddresses.txt`, {
  flags: 'a',
});

const streams = {
  'validAddresses': validAddressesStream,
  'invalidAddresses': invalidAddressesStream,
  'successfulAddresses': successfulAddressesStream,
  'failedAddresses': failedAddressesStream,
};

/**
 * Serialize data
 * @param {*} data 
 * @param {String} streamName 
 */
function serialize(data, streamName) {
  try {
    streams[streamName].write(data);
  } catch (error) {
    logger.error(`Failed to serialize data to ${streamName}.txt: ${error}`);
  }
}

module.exports = {
  serialize,
};
