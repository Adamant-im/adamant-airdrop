import kleur from 'kleur'

export const fatal = message => {
  console.error(`${kleur.red('Fatal Error:')}\n${message}`)

  process.exit(-1)
}
