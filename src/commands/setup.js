import { join, resolve } from 'path'

import { copyFile } from 'fs/promises'

import kleur from 'kleur'

import { prompt } from '../tui/components/prompt.js'
import { __dirname, createDirectory } from '../utils/dir.js'

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
  logCodeBlock(`cd ${campaignName}`)

  console.log('Edit the configuration file:')
  logCodeBlock('nano ./config.jsonc')

  console.log('Test airdrop (a dry run, no ADM will be sent):')
  logCodeBlock('npx adamant-airdrop --validate ./config.jsonc')

  console.log('Start airdrop:')
  logCodeBlock('npx adamant-airdrop ./config.jsonc')
}

function logCodeBlock(code) {
  console.log()
  console.log(`  ${kleur.magenta(code)}`)
  console.log()
}
