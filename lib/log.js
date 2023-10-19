const config = require('./configReader');
const dateTime = require('./dateTime');

const fs = require('fs');
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

const infoStr = fs.createWriteStream('./logs/' + dateTime.date() + '.log', {
  flags: 'a',
});

const validAddress = fs.createWriteStream('./logs/' + dateTime.date() + '-validAddress' + '.log', {
  flags: 'a',
});

const invalidAddress = fs.createWriteStream('./logs/' + dateTime.date() + '-invalidAddress' + '.log', {
  flags: 'a',
});

const succAddress = fs.createWriteStream('./logs/' + dateTime.date() + '-succAddress' + '.log', {
  flags: 'a',
});

const failAddress = fs.createWriteStream('./logs/' + dateTime.date() + '-failAddress' + '.log', {
  flags: 'a',
});

const files = {
  'invalidAddress': invalidAddress,
  'validAddress': validAddress,
  'failAddress': failAddress,
  'succAddress': succAddress,
};

infoStr.write(`\n\n[The bot started] _________________${dateTime.fullTime()}_________________\n`);

module.exports = {
  error(str, fileType, data) {
    if (['error', 'warn', 'info', 'log'].includes(config.log_level)) {
      if (!process.env.CLI_MODE_ENABLED) {
        console.log('\x1b[31m', 'error|' + dateTime.fullTime(), '\x1b[0m', str);
      }
      if (fileType) {
        files[fileType]?.write(`\n ` + 'error|' + dateTime.fullTime() + '|' + str);
        for (const el of data) {
          files[fileType]?.write(`\n` + el);
        }
      } else {
        infoStr.write(`\n ` + 'error|' + dateTime.fullTime() + '|' + str);
      }
    }
  },
  warn(str) {
    if (['warn', 'info', 'log'].includes(config.log_level)) {
      if (!process.env.CLI_MODE_ENABLED) {
        console.log('\x1b[33m', 'warn|' + dateTime.fullTime(), '\x1b[0m', str);
      }
      infoStr.write(`\n ` + 'warn|' + dateTime.fullTime() + '|' + str);
    }
  },
  info(str, fileType, data) {
    if (['info', 'log'].includes(config.log_level)) {
      if (!process.env.CLI_MODE_ENABLED) {
        console.log('\x1b[32m', 'info|' + dateTime.fullTime(), '\x1b[0m', str);
      }
      if (fileType) {
        files[fileType]?.write(`\n ` + 'info|' + dateTime.fullTime() + '|' + str);
        for (const el of data) {
          files[fileType]?.write(`\n` + el);
        }
      } else {
        infoStr.write(`\n ` + 'info|' + dateTime.fullTime() + '|' + str);
      }
    }
  },
  log(str) {
    if (['log'].includes(config.log_level)) {
      if (!process.env.CLI_MODE_ENABLED) {
        console.log('\x1b[34m', 'log|' + dateTime.fullTime(), '\x1b[0m', str);
      }
      infoStr.write(`\n ` + 'log|[' + dateTime.fullTime() + '|' + str);
    }
  },
};
