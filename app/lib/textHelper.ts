export const _decimalFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export const _integerFormat = new Intl.NumberFormat('en-US', {})

export const integerFormat = (number: number) => {
  return _integerFormat.format(number)
}

export const decimalFormat = (number: number) => {
  return _decimalFormat.format(number)
}

export const displayMoney = (number: number, zeroDisplay?: string) => {
  if (!zeroDisplay || number !== 0) return decimalFormat(number)
  else return '-'
}

export const displayInteger = (number: number, zeroDisplay?: string) => {
  if (!zeroDisplay || number !== 0) return integerFormat(number)
  else return '-'
}

export const displayUnit = (number: number, padding: number = 2, zeroDisplay?: string) => {
  if (!zeroDisplay || number !== 0) return number.toString().padStart(padding, '0')
  else return '-'
}

export const toFullMonthYear = (date: Date) => {
  var monthNamesThai = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤษจิกายน',
    'ธันวาคม'
  ]
  return `${monthNamesThai[date.getMonth()]} ${date.getFullYear() + 543}`
}

export const toShortMonthYear = (date: Date) => {
  var monthNamesThai = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'ม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.'
  ]
  return `${date.getDate()} ${monthNamesThai[date.getMonth()]} ${date.getFullYear()}`
}
