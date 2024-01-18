import kleur from 'kleur'

export const banner = () =>
  console.log(`${kleur.bold(
    `ADAMANT Airdrop v${process.env.npm_package_version}`
  )}
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
