const fs = require('fs');
const { pipeline } = require('stream/promises');
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

async function serializeProcessFileResult(validAddresses, invalidAddresses) {
  let validAddressesString = '';
  for (const address of validAddresses) {
    validAddressesString = validAddressesString + address + '\n';
  }
  await pipeline(
    validAddressesString,
    validAddressesStream,
  );

  let invalidAddressesString = '';
  for (const address of invalidAddresses) {
    invalidAddressesString = invalidAddressesString + address + '\n';
  }
  await pipeline(
    invalidAddressesString,
    invalidAddressesStream,
  );

  logger.log('Successfully serialized process file results');
}

module.exports = {
  serializeProcessFileResult,
};
