#!/usr/bin/env node

import { config } from '../utils/config/index.js'

import { banner } from '../tui/banner.js'

import { confirm } from '../tui/components/confirm.js'
import { Progress } from '../tui/components/progress.js'
import { Table, isEmpty, isFullfield } from '../tui/components/table.js'

import { validateAddresses } from '../lib/validator/index.js'
import { checkBalance } from '../lib/balance.js'
import { airdrop } from '../lib/airdrop.js'

import { validateOnlyFlag } from '../args.js'

export default async function () {
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
    .row('Sent a total of', `${amount} ADM`, {
      color: isFullfield(amount, totalAddresses * config.amount)
    })
    .row('Failed to send to', `${failedCount} addresses`, {
      color: isEmpty(failedCount, totalAddresses)
    })
    .row('Successfully sent to', `${successCount} addresses`, {
      color: isFullfield(successCount, totalAddresses)
    })
    .print()
}
