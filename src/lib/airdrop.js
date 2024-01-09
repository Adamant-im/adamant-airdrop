import { api } from './api.js'
import { config } from '../config/index.js'

export async function airdrop(progress, addresses) {
  const { serialize } = await import('../logger/output/index.js')

  const { passphrase, amount } = config

  const report = {
    failedCount: 0,
    successCount: 0,
    amount: 0
  }

  const serializeSuccess = (address, transactionId) => {
    report.successCount += 1

    serialize(
      [address, transactionId, amount, Date.now()],
      'successfulAddresses'
    )
  }

  const serializeError = (address, error) => {
    report.failedCount += 1

    progress.warn(`Unable to send ${amount} ADM to ${address}. Error: ${error}`)
    serialize(address, 'failedAddresses')
  }

  for (const address of addresses) {
    progress.set(`Sending ${amount} ADM to ${address}...`)

    try {
      const result = await api.sendTokens(passphrase, address, amount)

      if (!result?.success) {
        serializeError(address, result?.error || result)
        continue
      }

      serializeSuccess(address, result.transactionId)
    } catch (error) {
      serializeError(address, error)
    }
  }

  report.amount = amount * report.successCount

  progress.done()

  return report
}
