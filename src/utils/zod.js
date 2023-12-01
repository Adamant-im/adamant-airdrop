const issueSeparator = '; '
const unionSeparator = ', or '

export function fromZodError(zodError) {
  const reason = zodError.errors
    .map(issue =>
      getMessageFromZodIssue({
        issue,
        issueSeparator,
        unionSeparator
      })
    )
    .join(issueSeparator)

  return reason
}

function getMessageFromZodIssue({ issue, issueSeparator, unionSeparator }) {
  if (issue.code === 'invalid_union') {
    return issue.unionErrors
      .reduce((acc, zodError) => {
        const newIssues = zodError.issues
          .map(issue =>
            getMessageFromZodIssue({
              issue,
              issueSeparator,
              unionSeparator
            })
          )
          .join(issueSeparator)

        if (!acc.includes(newIssues)) {
          acc.push(newIssues)
        }

        return acc
      }, [])
      .join(unionSeparator)
  }

  if (issue.path.length !== 0) {
    // handle array indices
    if (issue.path.length === 1) {
      const identifier = issue.path[0]

      if (typeof identifier === 'number') {
        return `${issue.message} at index ${identifier}`
      }
    }

    if (issue.message === 'Required') {
      return `'${joinPath(issue.path)}' property is required`
    }

    return `${issue.message} at '${joinPath(issue.path)}'`
  }

  return issue.message
}

export function joinPath(path) {
  if (path.length === 1) {
    return path[0].toString()
  }

  return (
    path.reduce <
    string >
    ((acc, item) => {
      // handle numeric indices
      if (typeof item === 'number') {
        return acc + '[' + item.toString() + ']'
      }

      // handle quoted values
      if (item.includes('"')) {
        return acc + '["' + escapeQuotes(item) + '"]'
      }

      // handle special characters
      if (!identifierRegex.test(item)) {
        return acc + '["' + item + '"]'
      }

      // handle normal values
      const separator = acc.length === 0 ? '' : '.'
      return acc + separator + item
    },
    '')
  )
}

function escapeQuotes(str) {
  return str.replace(/"/g, '\\"')
}
