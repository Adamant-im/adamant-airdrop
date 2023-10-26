const { program } = require('commander');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const { validate } = require('./lib/validate');
const { airdrop } = require('./lib/airdrop');

program
  .requiredOption('--mode <mode>', 'specify run mode: airdrop/validate', 'validate');

program.parse();

async function main() {

  const options = program.opts();

  const { validAddresses } = await validate();

  if (options.mode === 'airdrop') {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question(`ATTENTION! \nStart airdrop? \nPlease, check your config once again \nType 'yes' to start: \n`);

    if (answer !== 'yes') {
      process.exit(0);
    }

    await airdrop(validAddresses);
  }

  process.exit(0);
}

main();
