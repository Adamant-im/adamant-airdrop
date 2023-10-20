const fs = require('fs');
const logger = require('./log');
const dateTime = require('./dateTime');

if (!fs.existsSync('./output')) {
  fs.mkdirSync('./output');
}

const outputDirName = dateTime.fullTime();

fs.mkdirSync(`./output/${outputDirName}`);
fs.mkdirSync(`./output/${outputDirName}/txt`);

const validAddressesStream = fs.createWriteStream(`./output/${outputDirName}/txt/validAddresses.txt`, {
  flags: 'a',
});

const invalidAddressesStream = fs.createWriteStream(`./output/${outputDirName}/txt/invalidAddresses.txt`, {
  flags: 'a',
});

const streams = {
  'validAddresses': validAddressesStream,
  'invalidAddresses': invalidAddressesStream,
};

function serializeToTxt(data, streamName) {
  try {
    streams[streamName].write(data);
    logger.log(`Successfully serialized data to ${streamName}.txt`);
  } catch (error) {
    logger.error(`Failed to serialize data to ${streamName}.txt: ${error}`);
  }
}

module.exports = {
  serializeToTxt,
};
