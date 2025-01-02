import type { TApiAuth, TApiGenericResponse } from '@/types/apiTypes'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const bookingStore = useBookingStore()
  const token = useCookie('Freyja-token')
  const { isHydration, payload } = useNuxtApp()
  const { bookingInfo } = storeToRefs(bookingStore)

  // 避免 重複發出 API 請求
  // 如果是在 client 端，且是 hydration 階段，且是 serverRendered，則返回
  if (import.meta.client && isHydration && payload.serverRendered) {
    return
  }
  if (!token.value) {
    return navigateTo('/account/login')
  }
  // booking / confirm 頁面 沒資料跳回首頁
  const NEED_BOOKING_INFO_PAGES = ['booking', 'confirm-detail']
  if (!bookingInfo.value && NEED_BOOKING_INFO_PAGES.includes(to.name as string)) {
    return navigateTo('/')
  }

  try {
    const authStatus = await $fetch<TApiGenericResponse<TApiAuth>>('/v1/user/check', {
      baseURL: 'https://nuxr3.zeabur.app/api',
      method: 'GET',
      headers: {
        Authorization: token.value,
      },
    })
    // console.log('驗證token成功', authStatus.status)
  }
  catch (error) {
    token.value = null
    return navigateTo('/account/login')
  }
})
