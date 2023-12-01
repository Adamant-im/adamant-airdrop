export const replaceWithDate = (text, dateObject) =>
  text.replace(/{([a-zA-Z_]*)}/g, (_, digit) => dateObject[digit])

export const formatDate = timestamp => {
  if (!timestamp) {
    return false
  }

  const dateObject = new Date(timestamp)

  const formattedDate = {
    year: dateObject.getFullYear(),
    month: dateObject.getMonth() + 1,
    date: dateObject.getDate(),
    hours: dateObject.getHours(),
    minutes: dateObject.getMinutes(),
    seconds: dateObject.getSeconds()
  }

  for (const digit in formattedDate) {
    if ({}.hasOwnProperty.call(formattedDate, digit)) {
      formattedDate[digit] = String(formattedDate[digit]).padStart(2, '0')
    }
  }

  formattedDate.YYYY_MM_DD = replaceWithDate(
    '{year}-{month}-{date}',
    formattedDate
  )
  formattedDate.YYYY_MM_DD_hh_mm = replaceWithDate(
    '{YYYY_MM_DD} {hours}:{minutes}',
    formattedDate
  )
  formattedDate.hh_mm_ss = replaceWithDate(
    '{hours}:{minutes}:{seconds}',
    formattedDate
  )

  return formattedDate
}

export const time = () => formatDate(Date.now()).hh_mm_ss

export const date = () => formatDate(Date.now()).YYYY_MM_DD

export const fullTime = () => `${time()} ${date()}`
