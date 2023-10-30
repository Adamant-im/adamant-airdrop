# ADAMANT Airdrop

## Installation and Usage

### Requirements

* Node.js v18+

### Setup

```(bash)
npm install
```

### Pre-launch tuning

Before running, copy `config.default.jsonc` file as `config.jsonc`

```(bash)
cp config.default.jsonc config.jsonc
```

### Launching

Run `validate` script before executing airdrop to check input files entries and account balance

```(bash)
npm run validate
```

You can check validation results at `./output/<time>/<format>/validate` dir

Running `airdrop` script

```(bash)
npm run airdrop
```

You can check airdrop results at `./output/<time>/<format>/airdrop` dir

If some of transactions were not sent, you can specify corresponding `failedAddresses.txt` as input file
