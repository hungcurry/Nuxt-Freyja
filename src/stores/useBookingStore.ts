import type { TBookingInfo, TBookingResult } from '@/types/dataTypes'

export const BookingStore = defineStore('booking', () => {
  const bookingInfo = ref<TBookingInfo | null>(null)
  const bookingResult = ref<TBookingResult | null>(null)

  const setBookingInfo = (info: TBookingInfo) => {
    bookingInfo.value = info
  }
  const setBookingResult = (info: TBookingResult) => {
    bookingResult.value = info
  }

  return {
    bookingInfo,
    bookingResult,
    setBookingInfo,
    setBookingResult,
  }
})
