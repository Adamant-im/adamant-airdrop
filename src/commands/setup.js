import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

import { copyFile } from 'fs/promises'

import kleur from 'kleur'

import { prompt } from '../tui/components/prompt.js'
import { createDirectory } from '../utils/dir.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function () {
  const campaignName = await prompt('Choose an Airdrop campaign name', {
    defaultResponse: 'adamant-airdrop'
  })

  await createCampaign(campaignName)

  printInstructions(campaignName)
}

async function createCampaign(campaignName) {
  createDirectory(campaignName)

  await copyDefaultConfig(campaignName)
}

async function copyDefaultConfig(campaignName) {
  return copyFile(
    join(__dirname, '../../config.default.jsonc'),
    resolve(`./${campaignName}/config.jsonc`)
  )
}

function printInstructions(campaignName) {
  console.log()
  console.log(
    'A new Airdrop campaign has been created. To enter the new directory, run:'
  )
  logCodeBlock(`cd '${campaignName}'`)

  console.log(
    'After editing the config file, you will be able to start airdrop via:'
  )
  logCodeBlock('npx adamant-airdrop ./config.jsonc')
}

function logCodeBlock(code) {
  console.log()
  console.log(`  ${kleur.magenta(code)}`)
  console.log()
}
