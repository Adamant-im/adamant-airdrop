import readline from 'readline'
import EventEmitter from 'events'

const { stdin, stdout } = process

export class BasePrompt extends EventEmitter {
  constructor(message = '') {
    super()

    this.message = message
    this.value = null

    this.aborted = false
    this.done = false

    this.rl = readline.createInterface({
      input: stdin,
      escapeCodeTimeout: 50
    })

    readline.emitKeypressEvents(stdin, this.rl)

    if (stdin.isTTY) {
      stdin.setRawMode(true)
    }

    stdin.on('keypress', this.keypress.bind(this))
  }

  render(outputText) {
    stdout.clearLine(0)
    stdout.cursorTo(0)
    stdout.write(outputText)
  }

  actionMap(key) {
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

    if (key.name === 'backspace') {
      return 'erase'
    }
  }

  submit(value) {
    this.close()
    this.emit('submit', value)
  }

  abort() {
    this.aborted = true
    this.close()
  }

  close() {
    this.done = true

    this.render()
    stdout.write('\n')

    stdin.removeListener('keypress', this.keypress.bind(this))

    stdin.setRawMode(false)
    this.rl.close()
  }
}
