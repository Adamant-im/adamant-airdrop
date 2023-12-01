#!/usr/bin/env node

import { config } from './config/index.js'

import { banner } from './tui/banner.js'

import { confirm } from './tui/confirm/index.js'
import { Progress } from './tui/progress/index.js'
import { Table, isEmpty, isFullfield } from './tui/table.js'

import { validateAddresses } from './validator/index.js'

import { checkBalance } from './lib/balance.js'
import { airdrop } from './lib/airdrop.js'

import { validateOnlyFlag } from './args.js'

run()

async function run() {
  banner()

  const progress = new Progress()

  const addresses = await validateAddresses(progress)

  const totalAddresses = addresses.length

  await checkBalance(progress, totalAddresses)

  if (!validateOnlyFlag) {
    const confirmed = await confirm(
      `Would you like to start Airdrop from ${config.address}?`
    )

    if (confirmed) {
      const { amount, failedCount, successCount } = await airdrop(
        progress,
        addresses
      )

      printSummary(amount, totalAddresses, failedCount, successCount)
    }
  }
}

function printSummary(amount, totalAddresses, failedCount, successCount) {
  new Table('Airdrop Summary')
    .row('Sent total', `${amount} ADM`, {
      color: isFullfield(amount, totalAddresses * config.amount)
    })
    .row('Failed to send to', `${failedCount} addresses`, {
      color: isEmpty(failedCount, totalAddresses)
    })
    .row('Successfuly sent to', `${successCount} addresses`, {
      color: isFullfield(successCount, totalAddresses)
    })
    .print()
}
