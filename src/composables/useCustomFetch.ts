import type { TApiResponse } from '@/types/apiTypes'
// ~外部元件使用
// ---------
// const apiUrl = 'https://nuxr3.zeabur.app/api/v1/home/news/'
// const { data, isLoading, FetchInit } = useCustomFetch<TNewsItem[]>()

// onMounted(async () => {
//   const res = await FetchInit(apiUrl)
//   console.log('res', res)
// })
// ---------
export function useCustomFetch<T>() {
  const isLoading = ref(false)
  // const newsList: Ref<TMenuItem[]> = ref([])
  // const newsList = ref<TMenuItem[]>([])
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)

  const FetchInit = async (apiUrl: string): Promise<{ status: boolean, data: T | null }> => {
    isLoading.value = true
    error.value = null

    try {
      const res = await $fetch<TApiResponse<T>>(apiUrl)
      data.value = res.result ?? null
      return { status: true, data: data.value }
    }
    catch (err) {
      console.error('錯誤訊息:', err)
      error.value = err instanceof Error ? err : new Error('未知錯誤')
      return { status: false, data: null }
    }
    finally {
      isLoading.value = false
    }
  }

  return { data, isLoading, error, FetchInit }
}
