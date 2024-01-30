import fs from 'fs'
import readline from 'readline'
import path from 'path'

import { fatalWithLog } from '../../utils/logger/index.js'

export async function* readAddresses(filePath) {
  try {
    const extension = path.extname(filePath)

    const generator =
      extension === '.json'
        ? readJSONAddresses(filePath)
        : readPlainAddresses(filePath)

    let loc = 0

    for await (const line of generator) {
      const location =
        extension === '.json' ? `index ${loc}` : `line ${loc + 1}`

      loc += 1

      yield [line, location]
    }
  } catch (error) {
    fatalWithLog(`Failed to process file ${filePath}: ${error}`)
  }
}

export function* readJSONAddresses(filePath) {
  const fileData = fs.readFileSync(filePath)
  const data = JSON.parse(fileData)

  if (!('list' in data)) {
    fatalWithLog(
      `JSON input file must have 'list' property with an array of addresses.`
    )
  }

  const { list } = data

  if (!Array.isArray(list)) {
    fatalWithLog(`'list' property in JSON input file must be an Array.`)
  }

  for (const item of list) {
    yield item
  }
}

export async function* readPlainAddresses(filePath) {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    yield line
  }
}
