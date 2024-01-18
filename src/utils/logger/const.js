export const logLevelNames = ['none', 'error', 'warn', 'info', 'log']

export const maxLogLevelLength = logLevelNames.reduce((max, current) => {
  const currentLength = current.length
  return currentLength > max ? currentLength : max
}, 0)

export const LogLevel = {
  None: 0,
  Error: 1,
  Warn: 2,
  Info: 3,
  Log: 4
}

export const getLogLevel = logLevelName => logLevelNames.indexOf(logLevelName)
