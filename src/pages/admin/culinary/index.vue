<script setup lang="ts">
import type { TApiCulinaryItem, TApiGenericResponse } from '@/types/apiTypes'
import { FetchError } from 'ofetch'

definePageMeta({
  layout: 'adminlayout',
  middleware: ['admin-auth'],
})

const route = useRoute()
const token = useCookie<string | null>('Freyja-token')
const { $swal } = useNuxtApp()
const { notifyWarn, notifySuccess, notifyError } = useNotifications()
const { $formatPrice } = useNuxtApp()
const { public: { apiBaseUrl } } = useRuntimeConfig()

// SSR
const { data: culinaryList, refresh } = await useFetch('/admin/culinary', {
  baseURL: apiBaseUrl,
  method: 'GET',
  headers: {
    Authorization: token.value ?? '',
  },
  transform: (response: TApiGenericResponse<TApiCulinaryItem[]>) => {
    const { result } = response || {}
    return result
  },
  onResponseError({ response }) {
    const { message } = response?._data
    console.error('Error', message)
    navigateTo('/')
  },
})
async function handleDeleteCulinary(id: string) {
  try {
    const swalOptions = {
      title: '即將刪除佳餚',
      text: '確定要刪除此佳餚嗎？',
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

    const response = await $fetch<TApiGenericResponse<any>>(`/admin/culinary/${id}`, {
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
  title: () => 'Freyja後台 | 佳餚管理',
  ogTitle: () => 'Freyja後台 | 佳餚管理',
  twitterCard: 'summary_large_image',
  twitterTitle: () => 'Freyja後台 | 佳餚管理',
})
</script>

<template>
  <h1 class="fs-3 mt-3">
    美味佳餚管理
  </h1>
  <small>Breadcrumb: {{ route.fullPath }}</small>
  <div class="card my-1 my-lg-4 shadow-sm">
    <div class="card-header">
      <div class="text-end py-2">
        <NuxtLink class="btn btn-primary text-light" to="/admin/culinary/new">
          <span class="bi bi-plus" />
          建立新的佳餚
        </NuxtLink>
      </div>
    </div>
    <div class="card-body">
      <table class="table table-hover">
        <thead class="bg-light">
          <tr class="align-middle">
            <th>標題</th>
            <th>用餐時間</th>
            <th>建立時間</th>
            <th>更新時間</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="culinary in culinaryList" :key="culinary._id">
            <td>{{ culinary.title }}</td>
            <td>{{ culinary.diningTime }}</td>
            <td><span v-timeFormat="culinary.createdAt" /></td>
            <td><span v-timeFormat="culinary.updatedAt" /></td>
            <td>
              <div class="btn-group">
                <NuxtLink
                  class="btn btn-outline-primary btn-sm"
                  :to="`/admin/culinary/edit/${culinary._id}`"
                >
                  編輯
                </NuxtLink>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="handleDeleteCulinary(culinary._id)"
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
