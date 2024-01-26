import kleur from 'kleur'
import { version } from '../utils/version.js'

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
