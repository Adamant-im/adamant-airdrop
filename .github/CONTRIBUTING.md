# Contributing Guide

Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Scripts](#scripts)

## Issue Reporting Guidelines

- Always use [GitHub Issues](https://github.com/Adamant-im/adamant-airdrop/issues) to create new issues.

## Pull Request Guidelines

- The master branch is just a snapshot of the latest stable release. All development should be done in dedicated branches. Do not submit PRs against the master branch.

- Checkout a topic branch from a base branch, e.g. `dev`, and merge back against that branch.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

- Commit messages must follow the [commit message convention](https://github.com/angular/angular/blob/68a6a07/CONTRIBUTING.md#commit). Commit messages are automatically validated before commit (by invoking [Git Hooks](https://git-scm.com/docs/githooks) via [husky](https://github.com/typicode/husky)).

- No need to worry about code style as long as you have installed the dev dependencies - modified files are automatically formatted with Prettier on commit (by invoking [Git Hooks](https://git-scm.com/docs/githooks) via [husky](https://github.com/typicode/husky)).

## Development Setup

You will need [Node.js](https://nodejs.org) **version 18+** and [pnpm](https://pnpm.io/).

After cloning the repo, run:

```bash
$ pnpm i # install the dependencies of the project
```

## Scripts

## `npm run airdrop`

The `aidrop` script starts base Airdrop script without arguments.

```bash
$ npm run airdrop ./config.json
```

## `npm run validate`

The `validate` script starts Airdrop script with `--validate` flag for input file validation.

```bash
$ npm run validate ./config.json
```

## `npm run validate`

The `validate` script starts Airdrop script with `--validate` flag for input file validation.

```bash
$ npm run validate ./config.json
```

## `npm run setup`

The `setup` script runs Airdrop setup.

```bash
$ npm run setup
```
