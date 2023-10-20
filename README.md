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

You can check valid and invalid addresses at `./output` dir.

Running airdrop script

```(bash)
npm run start
```
