import type { TApiRoomItem } from '@/types/apiTypes'
import type { TBookingInfo, TOrderResult } from '@/types/dataTypes'

export const BookingStore = defineStore('booking', () => {
  const bookingInfo = ref<TBookingInfo | null>(null)
  const roomInfo = ref<TApiRoomItem | null>(null)
  const bookingResult = ref<TOrderResult | null>(null)

  const setBookingInfo = (info: TBookingInfo) => {
    bookingInfo.value = info
  }
  const setRoomInfo = (info: TApiRoomItem) => {
    roomInfo.value = info
  }
  const setOrderResult = (info: TOrderResult) => {
    bookingResult.value = info
  }

  return {
    bookingInfo,
    bookingResult,
    roomInfo,
    setBookingInfo,
    setOrderResult,
    setRoomInfo,
  }
})
