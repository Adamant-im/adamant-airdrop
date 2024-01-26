import { SAT, fees } from 'adamant-api'

import { config } from '../utils/config/index.js'
import { fatalWithLog } from '../utils/logger/index.js'

import { api } from './api.js'

export async function checkBalance(progress, addressesCount) {
  const { address, amount } = config

  progress.set(
    `Retrieving information about the ${address} account's balance....`
  )
  const result = await api.getAccountBalance(address)

  if (!result.success) {
    fatalWithLog(`Failed to verify ${address} balance`)
  }

  const totalAmount = addressesCount * amount
  const totalFee = (addressesCount * fees.send) / SAT

  const estimatedBalance = totalAmount + totalFee

  const balance = Number(result.balance) / SAT

  if (balance < estimatedBalance) {
    fatalWithLog(
      `${address} account doesn't have enough ADM to execute all Airdrop transactions. Please add ${
        estimatedBalance - balance
      } more ADM to proceed.`
    )
  }

  progress.done(
    `${address} has enough balance for Aidrop: ${balance} ADM (${estimatedBalance} ADM needed: ${totalAmount} ADM to airdrop and ${totalFee} ADM for blockchain fees)`
  )
}
