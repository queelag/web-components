export function getDateDate(date: Date): string {
  let day: number

  day = date.getDate()
  if (day < 10) return `0${day}`

  return day.toString()
}

export function getDateHours(date: Date): string {
  let hours: number

  hours = date.getHours()
  if (hours < 10) return `0${hours}`

  return hours.toString()
}

export function getDateMinutes(date: Date): string {
  let minutes: number

  minutes = date.getMinutes()
  if (minutes < 10) return `0${minutes}`

  return minutes.toString()
}

export function getDateMilliseconds(date: Date): string {
  let milliseconds: number

  milliseconds = date.getMilliseconds()

  if (milliseconds < 10) return `00${milliseconds}`
  if (milliseconds < 100) return `0${milliseconds}`

  return milliseconds.toString()
}

export function getDateMonth(date: Date): string {
  let month: number

  month = date.getMonth() + 1
  if (month < 10) return `0${month}`

  return month.toString()
}

export function getDateSeconds(date: Date): string {
  let seconds: number

  seconds = date.getSeconds()
  if (seconds < 10) return `0${seconds}`

  return seconds.toString()
}
