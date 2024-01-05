const ADAMANT_ADDRESS_REGEXP = /U[0-9]{6,21}/

export class AddressesValidator {
  constructor(progress, { skipDuplicates = true }) {
    this.progress = progress

    this.skipDuplicates = skipDuplicates
    this.addresses = skipDuplicates ? new Set() : new Array()
  }

  findAndSaveAddress(line, location) {
    const found = line.match(ADAMANT_ADDRESS_REGEXP)

    if (!found) {
      this.progress.warn(`No ADAMANT address was found at ${location}: ${line}`)
      return
    }

    const [address] = found

    this.pushAddress(address)
  }

  pushAddress(address) {
    if (this.skipDuplicates) {
      if (this.addresses.has(address)) {
        this.progress.warn(`Skipping duplicate address: ${address}`)
        return
      }

      this.addresses.add(address)
    } else {
      this.addresses.push(address)
    }
  }
}
