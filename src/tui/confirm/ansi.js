// https://en.wikipedia.org/wiki/ANSI_escape_code

const CSI = '\x1B['

export const cursor = {
  hide: `${CSI}?25l`,
  show: `${CSI}?25h`
}

export const beep = '\u0007'
