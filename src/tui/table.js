import kleur from 'kleur'

export class Table {
  constructor(title) {
    this.title = title
    this.rows = []
    this.maxPropertyLength = 0
  }

  row(name, value, { color }) {
    this.maxPropertyLength = Math.max(this.maxPropertyLength, name.length)

    this.rows.push({
      name,
      value,
      color
    })

    return this
  }

  print() {
    console.log()
    console.log(`┌─ ${kleur.bold(this.title)}`)

    for (const item of this.rows) {
      const { name, color, value } = item

      const padding = ' '.repeat(this.maxPropertyLength - name.length)

      console.log(`│ ${name}:${padding} ${kleur[color](value)}`)
    }

    console.log()
  }
}

export function isFullfield(value, total) {
  if (value >= total) {
    return 'green'
  }

  if (value === 0) {
    return 'red'
  }

  return 'yellow'
}

export function isEmpty(value, total) {
  if (value === 0) {
    return 'green'
  }

  if (value >= total) {
    return 'red'
  }

  return 'yellow'
}
