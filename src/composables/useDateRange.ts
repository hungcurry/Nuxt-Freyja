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

  // 日期格式化 (YYYY/MM/DD)
  function formatDateTitle(date?: string) {
    return date?.replaceAll('-', ' / ')
  }

  // 手機版日期格式化 (MM/DD)
  const formatDateOnMobile = (dateString: string) => {
    const [, month, day] = dateString.split('-')
    return `${month} / ${day}`
  }

  // 取得日期星期幾
  const formatDateWeekday = (dateString: string) => {
    const date = new Date(dateString)
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = weekdays[date.getDay()]
    return `${month} 月 ${day} 日 ${weekday}`
  }

  return {
    todayDate,
    tommorowDate,
    nextYearDate,
    formatDate,
    formatDateTitle,
    formatDateOnMobile,
    formatDateWeekday,
  }
}
