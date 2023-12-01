import readline from 'readline'
import EventEmitter from 'events'

import kleur from 'kleur'

import { icons } from '../icons.js'
import { cursor, beep } from './ansi.js'

const { stdin, stdout } = process

const actionMap = key => {
  if (key.meta && key.name !== 'escape') {
    return
  }

  if (key.ctrl) {
    if (['c', 'd'].includes(key.name)) {
      return 'abort'
    }
  }

  if (key.name === 'escape') {
    return 'abort'
  }

  if (['return', 'enter'].includes(key.name)) {
    return 'submit'
  }
}

class ConfirmPrompt extends EventEmitter {
  constructor(message = '') {
    super()

    this.message = message
    this.value = null

    this.done = false
    this.closed = false

    this.rl = readline.createInterface({
      input: stdin,
      escapeCodeTimeout: 50
    })

    readline.emitKeypressEvents(stdin, this.rl)

    if (stdin.isTTY) {
      stdin.setRawMode(true)
    }

    stdout.write(cursor.hide)

    stdin.on('keypress', this.keypress.bind(this))

    this.render()
  }

  render() {
    const symbol = this.done
      ? this.value
        ? kleur.green(icons.check)
        : kleur.red(icons.cross)
      : kleur.bold(kleur.cyan(icons.question))

    const question = kleur.bold(this.message)

    const answer = this.done
      ? this.value
        ? kleur.green('Yes')
        : kleur.red(this.value === null ? 'Operation canceled' : 'No')
      : kleur.gray('y/N')

    const outputText = `${symbol} ${question} ${answer}`

    stdout.clearLine(0)
    stdout.cursorTo(0)
    stdout.write(outputText)
  }

  keypress(str, key) {
    const action = actionMap(key)

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

  submit(value) {
    this.value = value

    this.abort()

    this.emit('submit', value)
  }

  abort() {
    this.done = true
    this.render()
    stdout.write('\n')
    this.close()
  }

  close() {
    this.closed = true

    stdout.write(cursor.show)
    stdin.removeListener('keypress', this.keypress.bind(this))

    stdin.setRawMode(false)
    this.rl.close()
  }
}

export const confirm = message => {
  return new Promise(resolve => {
    const prompt = new ConfirmPrompt(message)
    prompt.on('submit', resolve)
  })
}
