import fs from 'fs/promises'
import { join } from 'path'

import kleur from 'kleur'

import { __dirname } from '../utils/dir.js'

const { version } = JSON.parse(
  await fs.readFile(join(__dirname, '../../package.json'), 'utf-8')
)

export const banner = () =>
  console.log(`${kleur.bold(`ADAMANT Airdrop v${version}`)}
by ADAMANT Foundation           |
${kleur.grey('devs@adamant.im')}                 |
                              .-'-.
                             ' ___ '
                   ---------'  .-.  '---------
   _________________________'  '-'  '_________________________
    ''''''-|---|--/    \\==][^',_m_,'^][==/    \\--|---|-''''''
                  \\    /  ||/   H   \\||  \\    /
                   '--'   OO   O|O   OO   '--'

`)
