import kleur from 'kleur'

import { icons } from '../icons.js'
import { BasePrompt } from './base-prompt.js'

class ConfirmPrompt extends BasePrompt {
  constructor(message = '', { defaultResponse }) {
    super(message)

    this.value = ''
    this.defaultResponse = defaultResponse

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
      ? kleur.red('Operation canceled.')
      : this.done
        ? kleur.green(this.value || this.defaultResponse)
        : this.value
          ? kleur.green(this.value)
          : kleur.grey(this.defaultResponse)

    const outputText = `${symbol} ${question} ${answer}`

    super.render(outputText)
  }

  keypress(str, key) {
    const action = this.actionMap(key)

    if (action === 'abort') {
      return this.abort()
    }

    if (action === 'submit') {
      return this.submit()
    }

    if (action === 'erase') {
      if (this.value) {
        this.value = this.value.slice(0, -1)
        this.render()
      }

      return
    }

    if (typeof str === 'string') {
      this.append(str)
    }
  }

  append(str) {
    this.value += str
    this.render()
  }

  submit() {
    super.submit(this.value || this.defaultResponse)
  }
}

export const prompt = (message, { defaultResponse }) => {
  return new Promise(resolve => {
    const prompt = new ConfirmPrompt(message, { defaultResponse })
    prompt.on('submit', resolve)
  })
}
