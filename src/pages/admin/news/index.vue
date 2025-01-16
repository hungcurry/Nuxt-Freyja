<script setup lang="ts">
import type { TApiGenericResponse, TApiNewsItem } from '@/types/apiTypes'
import { FetchError } from 'ofetch'

definePageMeta({
  layout: 'adminlayout',
  middleware: ['admin-auth'],
})

const token = useCookie<string | null>('Freyja-token')
const { $swal } = useNuxtApp()
const { notifyWarn, notifySuccess, notifyError } = useNotifications()
const { public: { apiBaseUrl } } = useRuntimeConfig()

// SSR
const { data: newsList, refresh } = await useFetch('/admin/news', {
  baseURL: apiBaseUrl,
  method: 'GET',
  headers: {
    Authorization: token.value ?? '',
  },
  transform: (response: TApiGenericResponse<TApiNewsItem[]>) => {
    const { result } = response
    return result
  },
  onResponseError({ response }) {
    const { message } = response?._data
    console.error('Error', message)
    navigateTo('/')
  },
})
async function handleDeleteNews(id: string) {
  try {
    const swalOptions = {
      title: '即將刪除最新消息',
      text: '確定要刪除此最新消息嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#eb5a68',
      cancelButtonColor: '#8bafd7',
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消',
    } as const

    const result = await $swal.fire(swalOptions)
    if (!result.isConfirmed)
      return

    const response = await $fetch<TApiGenericResponse<any>>(`/admin/news/${id}`, {
      baseURL: apiBaseUrl,
      method: 'DELETE',
      headers: {
        Authorization: token.value ?? '',
      },
    })

    if (response?.status) {
      notifySuccess('success', '刪除成功')
      refresh()
    }
  }
  catch (error) {
    if (error instanceof FetchError) {
      const message = error.response?._data.message || '發生未知錯誤，請稍後再試'
      notifyError('error', message)
    }
  }
}
// seo
useSeoMeta({
  title: () => 'Freyja後台 | 最新消息管理',
  ogTitle: () => 'Freyja後台 | 最新消息管理',
  twitterCard: 'summary_large_image',
  twitterTitle: () => 'Freyja後台 | 最新消息管理',
})
</script>

<template>
  <h1 class="fs-3 mt-3">
    消息管理
  </h1>
  <div class="card my-1 my-lg-4 shadow-sm">
    <div class="card-header">
      <div class="text-end py-2">
        <NuxtLink class="btn btn-primary text-light" to="/admin/news/new">
          <span class="bi bi-plus" />
          建立最新消息
        </NuxtLink>
      </div>
    </div>

    <div class="card-body">
      <table class="table table-hover">
        <thead class="bg-light">
          <tr class="align-middle">
            <th />
            <th>標題</th>
            <th>建立時間</th>
            <th>更新時間</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="news in newsList" :key="news._id">
            <td><img class="img-fluid w-100px" :src="news.image" :alt="news.title"></td>
            <td>{{ news.title }}</td>
            <td><span v-timeFormat="news.createdAt" /></td>
            <td><span v-timeFormat="news.updatedAt" /></td>
            <td>
              <div class="btn-group">
                <NuxtLink
                  class="btn btn-outline-primary btn-sm"
                  :to="`/admin/news/edit/${news._id}`"
                >
                  編輯
                </NuxtLink>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="handleDeleteNews(news._id)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
