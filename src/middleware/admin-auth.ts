import type { TApiAuth, TApiGenericResponse } from '@/types/apiTypes'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie<string | null>('Freyja-token')
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const { isHydration, payload } = useNuxtApp()

  // 避免 重複發出 API 請求
  // 如果是在 client 端，且是 hydration 階段，且是 serverRendered，則返回
  if (import.meta.client && isHydration && payload.serverRendered) {
    return
  }
  if (!token.value) {
    return navigateTo('/admin/login')
  }

  try {
    const authStatus = await $fetch<TApiGenericResponse<TApiAuth>>('/user/check', {
      baseURL: apiBaseUrl,
      method: 'GET',
      headers: {
        Authorization: token.value ?? '',
      },
    })
  }
  catch (error) {
    token.value = null
    return navigateTo('/admin/login')
  }
})
