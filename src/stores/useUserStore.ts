import type { TApiUser } from '@/types/apiTypes'

export const UserStore = defineStore('user', () => {
  const userInfo = ref<TApiUser | null>(null)
  const setUserInfo = (info: TApiUser) => {
    userInfo.value = info
  }
  return {
    userInfo,
    setUserInfo,
  }
})
