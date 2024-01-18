import kleur from 'kleur'

import { icons } from '../icons.js'
import { cursor, beep } from '../ansi.js'
import { BasePrompt } from './base-prompt.js'

const { stdout } = process

class ConfirmPrompt extends BasePrompt {
  constructor(message = '') {
    super(message)

    stdout.write(cursor.hide)

    this.render()
  }

  render() {
    const symbol = this.aborted
      ? kleur.red(icons.cross)
      : this.done
        ? kleur.green(icons.check)
        : kleur.bold(kleur.cyan(icons.question))

    const question = kleur.bold(this.message)

    const answer = this.aborted
      ? kleur.red('Operation canceled')
      : this.done
        ? this.value
          ? kleur.green('Yes')
          : kleur.red('No')
        : kleur.gray('y/N')

    const outputText = `${symbol} ${question} ${answer}`

    super.render(outputText)
  }

  keypress(str, key) {
    const action = this.actionMap(key)

    if (action === 'abort') {
      return this.abort()
    }

    if (action === 'submit') {
      return this.submit(false)
    }

    if (typeof str === 'string') {
      const keyName = str.toLowerCase()

      if (keyName === 'y') {
        return this.submit(true)
      }

      if (keyName === 'n') {
        return this.submit(false)
      }
    }

    // Do *beep* sound on unknown key :)
    stdout.write(beep)
  }

  close() {
    stdout.write(cursor.show)
    super.close()
  }

  submit(value) {
    this.value = value

    super.submit(value)
  }
}

export const confirm = message => {
  return new Promise(resolve => {
    const prompt = new ConfirmPrompt(message)
    prompt.on('submit', resolve)
  })
}
