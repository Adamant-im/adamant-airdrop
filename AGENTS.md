# ADAMANT Airdrop: AI Agent Operating Manual

This document defines how AI agents must work in this repository. It covers working conventions and a short technical map. When the code and this document disagree, the code is the truth — fix the document in the same pull request.

## Mission

`adamant-airdrop` is a Node.js command-line tool that sends one fixed amount of ADM from an operator's account to every address in a list. It signs transactions locally with `adamant-api` and broadcasts them to configurable ADAMANT nodes. Every send is a real, irreversible transfer.

Agent output must optimize for:

1. Funds safety — the operator pays exactly the confirmed amount, to exactly the listed addresses, once
2. Security — the passphrase never leaves the machine and never appears in output, logs, or files
3. Reliability and operator clarity — predictable runs, honest reports, actionable errors
4. Simplicity — the codebase is intentionally small; avoid over-engineering

If a tradeoff is needed, preserve the operator's funds first.

## Language Policy

- Developers may communicate with AI in any language
- All repository artifacts must be in English only: code, comments, docs, commit messages, issues, and PR text

## Writing Style and Markdown

- Use concise, operational wording over marketing language
- In bullet and numbered lists, do not add a trailing period when an item contains one sentence
- If an item contains two or more sentences, end every sentence with a period
- Keep one blank line before and after every list, including after a heading, to satisfy MD032 (`blanks-around-lists`)
- Use fenced code blocks with matching fences and a language tag when applicable
- Repository overrides live in `.markdownlint.jsonc`; Prettier formats Markdown too
- Add code comments only for non-obvious logic

## Stack

- Node.js 18 or newer, ES modules, no build step; `src/index.js` is the published `bin`, run as `npx adamant-airdrop`
- pnpm only: the `preinstall` script enforces it. `pnpm-lock.yaml` is lockfile v6, which pnpm 9 and newer refuse, so run `npx pnpm@8` until the lockfile is migrated in a dedicated change.
- `adamant-api` 2.x for node access, signing, key derivation, `SAT`, and `fees`
- `zod` 3 for the config schema and `jsonminify` for JSONC
- The terminal UI is hand-written in `src/tui/*` on top of `kleur`
- Prettier 3 and commitlint run from Husky hooks
- There is no ESLint and no automated test suite yet

## System Map

- `src/index.js` — entry point; loads `src/commands/<action>.js` for the action resolved in `src/args.js`
- `src/args.js` — hand-rolled argv parsing: `[configPath]`, `--validate`, `setup`, `--version` / `-v`
- `src/commands/airdrop.js` — the pipeline: banner, address validation, balance check, confirmation, sending, summary
- `src/commands/setup.js` — creates a campaign directory and copies `config.default.jsonc` into it as `config.jsonc`
- `src/utils/config/index.js` — reads, parses, and validates the config, derives `config.address`, and resolves `inputFile` and `outputPath` relative to the config file
- `src/utils/config/schema.js` — strict `zod` schema; unknown keys are rejected
- `src/lib/validator/*` — reads `.json` files (a `list` array) or line-based files, extracts one address per entry, and drops duplicates when `skipDuplicates` is on
- `src/lib/balance.js` — aborts unless the balance covers every transfer plus `fees.send` per transfer
- `src/lib/airdrop.js` — sends to each address sequentially with `api.sendTokens` and records each result
- `src/lib/api.js` — the shared `AdamantApi` client over `config.nodes`
- `src/utils/logger/*` — the run log in `./logs/YYYY-MM-DD.log` and result CSVs in `<outputPath>/<date time>/`
- `config.default.jsonc` — the documented config template; `examples/*` — sample input lists

Importing `src/utils/config` or `src/utils/logger` reads the config path from `argv` at import time and exits on failure. Keep both out of the `setup` and `version` import graphs. `src/lib/airdrop.js` imports the result writer lazily so that `--validate` creates no result files.

## Invariants

Keep these unchanged unless the task explicitly approves a breaking change:

- CLI surface: `adamant-airdrop <config>`, `--validate <config>`, `setup`, `--version` / `-v`
- Config field names and defaults in `schema.js`, `config.default.jsonc`, and `README.md`
- `amount` is in ADM; `adamant-api` converts it to sats because `isAmountInADM` defaults to `true`
- `--validate` is a dry run: it reads addresses and checks the balance, and never sends
- Nothing is sent before the operator answers the confirmation prompt
- Result CSV names, columns, and the per-run output directory, because operators process them
- Sending stays sequential, one transaction at a time

## Funds Safety Rules

- Treat every amount, fee, and unit conversion as money code. `SAT` is 10^8 sats per ADM, and `fees.send` is in sats.
- Never add a way to send without the confirmation prompt, such as a `--yes` flag or a non-TTY default, without maintainer approval
- Never retry `sendTokens` automatically. A timeout or network error does not prove that the transaction was not broadcast, so a row in `failedTransactions.csv` means "outcome unknown", not "unpaid".
- A rerun with the same input pays everyone again because there is no resume. Any resume or skip logic must be explicit, visible to the operator, and based on recorded transaction IDs.
- Keep the balance check fee-inclusive and before the confirmation prompt
- Do not loosen address extraction, and keep rejected lines as visible warnings instead of silent drops
- Never run a real airdrop from an agent session: no run without `--validate`, and never answer the confirmation prompt. Real sends belong to the human operator, preferably on testnet first.

## Security Rules

- Never log, print, or persist the passphrase or private keys — not in output, errors, logs, result files, or fixtures
- Do not echo raw config content in errors. A `JSON.parse` error can quote part of the input, including the passphrase.
- The passphrase is used only for local signing through `adamant-api`; nodes receive signed transactions only
- Only `config.jsonc` and `config.test.jsonc` are git-ignored. Keep any other local config in `.ai-ignored/`, and never commit a funded passphrase.
- Treat the address list as untrusted input
- Feed the command loader in `src/index.js` only with the fixed actions from `src/args.js`; add no other dynamic code execution, unsafe deserialization, or shell execution paths
- Minimize new dependencies, especially cryptography and networking ones. `commander`, `prompts`, `kolorist`, and `prettier` are declared in `dependencies` but not imported by `src/`; remove unused direct dependencies instead of building on them.
- Take default node URLs from the canonical ADM node list in [`adamant-wallets`](https://github.com/Adamant-im/adamant-wallets) (`assets/general/adamant/info.json`)

## Validation

```bash
npx pnpm@8 install --frozen-lockfile
npx pnpm@8 exec prettier --check .
node src/index.js --version
script -q /dev/null node src/index.js --validate .ai-ignored/config.jsonc
```

- The terminal UI needs a TTY and crashes with `stdout.clearLine is not a function` when output is piped. In a non-interactive shell, run it under `script`: `script -q /dev/null <command>` on macOS, `script -qec "<command>" /dev/null` on Linux.
- For a smoke run, copy `config.default.jsonc` to `.ai-ignored/config.jsonc` and keep every field, because schema defaults are not applied and an omitted `outputPath` crashes
- In that config, use a throwaway passphrase (`createNewPassphrase()` from `adamant-api`), testnet nodes from `adamant-wallets`, and paths relative to `.ai-ignored/`, for example `"inputFile": "../examples/example.list.csv"`
- `--validate` queries the configured nodes for the balance. An unfunded throwaway account stops at the balance check, which is expected.
- The run log is written to `./logs/` relative to the current directory
- With no test suite, report exactly which commands and manual checks were run, and what was not run and why. For a documentation-only change, say that runtime checks were not run.
- If you add the first tests, propose the runner in the PR; the built-in `node:test` avoids a new dependency
- Never claim a command passed without having run it

## Git Workflow

- Branch from `dev` and target `dev`; `master` is the latest stable release snapshot and only receives release merges
- Name branches with a type prefix such as `feat/`, `fix/`, `docs/`, `refactor/`, or `chore/`
- Commit messages follow Conventional Commits, checked by commitlint in the Husky `commit-msg` hook: lowercase type and subject, for example `docs: add AGENTS.md` or `fix(reader): skip empty lines`
- The Husky `pre-commit` hook runs Prettier over the whole repository but does not re-stage files. Run `pnpm run format` before staging, and check `git status` after committing.

## Issue, Label, and PR Conventions

Follow the organization-wide conventions:

- Governance repository, issue forms, PR template, and label catalog (`labels.json`): <https://github.com/Adamant-im/.github>
- Issue title prefixes: <https://github.com/orgs/Adamant-im/discussions/5>
- Labels: <https://github.com/orgs/Adamant-im/discussions/1>

### Issues

1. Search existing issues first to avoid duplicates
2. Structure the body after the org issue forms (Bug / Feature request / Task); a task uses `Summary`, `Details`, `Checklist`, `Notes`, and `Verification`
3. Start the title with one or two prefixes at most: `[Bug]`, `[Feat]`, `[Enhancement]`, `[Refactor]`, `[Docs]`, `[Test]`, `[Chore]`, `[Task]`, `[Composite]`, or `[UX/UI]`. Keep `[Proposal]`, `[Idea]`, and `[Discussion]` for Discussions.
4. Apply a minimal but informative label set: one type label (`bug`, `enhancement`, `Task`, `Composite task`) plus one or more domain labels (`NodeJS`, `JavaScript`, `Cryptocurrency`, `Security`, `documentation`, `Guideline`, etc.). Add `High priority` only when the work is urgent.
5. Set the issue type (`Task`, `Bug`, or `Feature`) and add the issue to the `Explorer, Pool, Airdrop` project
6. Link related issues and PRs explicitly

Label casing follows the catalog: default GitHub labels are lowercase, and custom labels are capitalized. Do not invent labels.

### Pull Requests

- Fill in the org PR template sections (`Description`, `Related issue`, `Breaking changes`, `How to test`, `Checklist`, etc.)
- Title format: `Type: Short summary`, for example `Docs: Add AGENTS.md`. Square-bracket prefixes are for issues only.
- Keep the PR title type aligned with the issue intent (`Docs:`, `Fix:`, `Feat:`, `Refactor:`, `Test:`, `Chore:`)
- Reference the issue with a closing keyword (`Closes #<id>`), and link the PR back from the issue
- Include verification steps and call out risk areas: funds, passphrase handling, config compatibility

### Multi-line CLI Input

When a CLI tool accepts multi-line input, write it to a dated temporary file in `.ai-ignored/` (git-ignored) instead of an inline multi-line shell string:

```bash
gh issue create \
  --title "[Docs] Short summary" \
  --body-file .ai-ignored/temp.YYYY-MM-DD.issue-body.md \
  --label "Task,documentation"

gh pr create \
  --base dev \
  --title "Docs: Short summary" \
  --body-file .ai-ignored/temp.YYYY-MM-DD.pr-description.md

git commit -F .ai-ignored/temp.YYYY-MM-DD.commit-message.md
```

Cleanup is optional, but never reuse stale content by accident.

## Sources of Truth

- This repository: current code, `README.md`, `.github/CONTRIBUTING.md`, and `config.default.jsonc`
- [`adamant-api-jsclient`](https://github.com/Adamant-im/adamant-api-jsclient): request, signing, fee, and unit semantics of the `adamant-api` package
- [`adamant-wallets`](https://github.com/Adamant-im/adamant-wallets): canonical mainnet and testnet ADM node lists
- ADAMANT docs: <https://docs.adamant.im>
- Baseline guidelines: [`adamant` AGENTS.md](https://github.com/Adamant-im/adamant/blob/dev/AGENTS.md) and [`AI_AGENT_NOTES.md`](https://github.com/Adamant-im/adamant/blob/dev/AI_AGENT_NOTES.md)
- Sibling Node.js tools: [`adamant-console`](https://github.com/Adamant-im/adamant-console/blob/master/AGENTS.md) and [`adamant-exchangebot`](https://github.com/Adamant-im/adamant-exchangebot/blob/dev/AGENTS.md)

If sources disagree, treat current repository behavior as implementation truth, and document the mismatch instead of silently changing behavior.

## Documentation Drift Policy

- Keep `README.md`, `.github/CONTRIBUTING.md`, `config.default.jsonc` comments, and this file aligned with the code
- A new or changed config field means updating `schema.js`, `config.default.jsonc` with a comment, and `README.md` in the same PR
- When a mismatch cannot be fixed in scope, document it with exact file references and open a linked follow-up issue

## AI Change Workflow

1. Read the relevant modules end-to-end before editing
2. Identify the invariants that must stay unchanged
3. Make the smallest change that fully solves the problem; match the local style of touched files and keep cleanup local
4. Run the validation commands that apply
5. Report what changed, what intentionally did not, what was run and what was not, and the remaining risks

## Definition of Done

- The funds-safety and security rules above still hold
- Relevant validation commands were run, or the blocker is reported
- Docs and `config.default.jsonc` are updated for any behavior or config change
- All repository artifacts are in English

## When to Escalate to Maintainers

Stop and ask for human review before proceeding if the change:

- Affects how amounts, fees, or balances are calculated, or who gets paid
- Adds retries, resume, parallel sending, or any path that skips the confirmation prompt
- Touches passphrase handling, key derivation, or signing
- Changes the CLI surface, the config schema, or the result file format
- Cannot be shown to preserve funds safety
