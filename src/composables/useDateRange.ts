export function useDateRange() {
  // 日期格式化工具函數
  const formatToLocaleDate = (date: Date) => {
    return date.toLocaleDateString('en-CA')
  }

  // 取得指定天數後的日期
  const getDateAfterDays = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return formatToLocaleDate(date)
  }

  // 取得今天、明天和一年後日期
  const todayDate = getDateAfterDays(0)
  const tommorowDate = getDateAfterDays(1)
  const nextYearDate = getDateAfterDays(365)

  // 日期格式化 (YYYY-MM-DD)
  const formatDate = (date: Date, timezoneOffset: number = 0) => {
    const timestamp = date.getTime() + timezoneOffset * 60 * 60 * 1000
    return new Date(timestamp).toISOString().split('T')[0]
  }
  // 手機版日期格式化 (MM/DD)
  const formatDateOnMobile = (dateString: string) => {
    const [, month, day] = dateString.split('-')
    return `${month} / ${day}`
  }

  return {
    todayDate,
    tommorowDate,
    nextYearDate,
    formatDate,
    formatDateOnMobile,
  }
}
