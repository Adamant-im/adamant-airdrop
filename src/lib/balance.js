import { SAT, fees } from 'adamant-api'

import { config } from '../config/index.js'
import { fatal } from '../logger/index.js'

import { api } from './api.js'

export async function checkBalance(progress, addressesCount) {
  const { address, amount } = config

  progress.set(
    `Retrieving information about the ${address} account's balance....`
  )
  const result = await api.getAccountBalance(address)

  if (!result.success) {
    fatal(`Failed to verify ${address} balance`)
  }

  const balance = Number(result.balance)
  const estimatedBalance = addressesCount * (amount * SAT + fees.send)

  if (balance < estimatedBalance) {
    fatal(
      `${address} account doesn't have enough ADM to execute all Airdrop transactions. Please add ${
        (estimatedBalance - balance) / SAT
      } more ADM to proceed.`
    )
  }

  progress.done(
    `${address} has enough balance for Aidrop: ${balance / SAT} ADM (${
      estimatedBalance / SAT
    } ADM needed)`
  )
}
