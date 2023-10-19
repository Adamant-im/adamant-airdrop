const jsonminify = require('jsonminify');
const fs = require('fs');
const path = require('path');
const keys = require('adamant-api/src/helpers/keys');
const isDev = process.argv.includes('dev');
let config = {};

// Validate config fields
const fields = {
  passPhrase: {
    type: String,
    isRequired: false,
  },
  node_ADM: {
    type: Array,
    isRequired: false,
  },
};

try {
  let configFile;

  if (isDev || process.env.JEST_WORKER_ID) {
    configFile = '../config.test.jsonc';
  } else {
    if (fs.existsSync(path.join(__dirname, '../config.jsonc'))) {
      configFile = '../config.jsonc';
    } else {
      configFile = '../config.default.jsonc';
    }
  }

  // __dirname = ./modules
  config = JSON.parse(jsonminify(fs.readFileSync(path.join(__dirname, configFile), 'utf-8')));

  if (config.passPhrase?.length < 35) {
    config.passPhrase = undefined;
  }

  try {
    keyPair = keys.createKeypairFromPassPhrase(config.passPhrase);
  } catch (e) {
    exit(`Bot's config is wrong. Invalid passPhrase. Error: ${e}. Cannot start the Bot.`);
  }

  Object.keys(fields).forEach((f) => {
    if (!config[f] && fields[f].isRequired) {
      exit(`Bot's ${address} config is wrong. Field _${f}_ is not valid. Cannot start Bot.`);
    } else if (!config[f] && config[f] !== 0 && fields[f].default) {
      config[f] = fields[f].default;
    }
    if (config[f] && fields[f].type !== config[f].__proto__.constructor) {
      exit(`Bot's ${address} config is wrong. Field type _${f}_ is not valid, expected type is _${fields[f].type.name}_. Cannot start Bot.`);
    }
  });

  console.info(`Successfully read the config-file '${configFile}'${isDev ? ' (dev)' : ''}.`);
} catch (e) {
  exit('Error reading config: ' + e);
}

function exit(msg) {
  console.error(msg);
  process.exit(-1);
}

config.isDev = isDev;
module.exports = config;
