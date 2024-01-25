import kleur from 'kleur'

import * as logger from '../../utils/logger/index.js'
import { icons } from '../icons.js'

const { stdout } = process

export class Progress {
  constructor(message) {
    this.message = message

    const frames = ['◜', '◠', '◝', '◞', '◡', '◟']

    this.frames = frames
    this.total = frames.length
    this.current = 0
  }

  start() {
    this.started = true

    this.render()
    this.interval = setInterval(() => {
      this.current = (this.current + 1) % this.total
      this.render()
    }, 100)
  }

  stop() {
    this.started = false
    clearInterval(this.interval)
  }

  set(message) {
    logger.log(message)

    this.message = message

    if (!this.started) {
      this.start()
    } else {
      this.render()
    }
  }

  done(message) {
    logger.info(message)

    this.stop()

    if (message) {
      this.message = message
      this.render(true)
      stdout.write('\n')
    } else {
      // clear progress message
      stdout.clearLine(0)
      stdout.cursorTo(0)
    }
  }

  log(message) {
    logger.log(message)

    this.clearLine()
    stdout.write(kleur.cyan(kleur.bold('⦁')) + ' ' + message + '\n')
  }

  warn(message) {
    logger.warn(message)

    this.clearLine()
    stdout.write(kleur.yellow(kleur.bold('⚠')) + ' ' + message + '\n')
  }

  render(isDone) {
    this.clearLine()

    const symbol = isDone
      ? kleur.green(icons.check)
      : kleur.cyan(this.frames[this.current])
    stdout.write(`${symbol} ${this.message}`)
  }

  clearLine() {
    stdout.clearLine(0)
    stdout.cursorTo(0)
  }
}
