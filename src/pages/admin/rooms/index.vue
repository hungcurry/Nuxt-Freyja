<script setup lang="ts">
import type { TApiGenericResponse, TApiRoomItem } from '@/types/apiTypes'
import { FetchError } from 'ofetch'

definePageMeta({
  layout: 'adminlayout',
  middleware: ['admin-auth'],
})

const token = useCookie<string | null>('Freyja-token')
const { $swal } = useNuxtApp()
const { notifyWarn, notifySuccess, notifyError } = useNotifications()
const { $formatPrice } = useNuxtApp()
const { public: { apiBaseUrl } } = useRuntimeConfig()

// SSR
const { data: roomsList, refresh } = await useFetch('/admin/rooms', {
  baseURL: apiBaseUrl,
  method: 'GET',
  headers: {
    Authorization: token.value ?? '',
  },
  transform: (response: TApiGenericResponse<TApiRoomItem[]>) => {
    const { result } = response
    return result
  },
  onResponseError({ response }) {
    const { message } = response?._data
    console.error('Error', message)
    navigateTo('/')
  },
})
async function handleDeleteRoom(title: string, id: string) {
  try {
    const swalOptions = {
      title: '即將刪除房型',
      text: `確定要刪除「${title}」嗎？`,
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

    const response = await $fetch<TApiGenericResponse<any>>(`/admin/rooms/${id}`, {
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
  title: () => 'Freyja後台 | 房型管理',
  ogTitle: () => 'Freyja後台 | 房型管理',
  twitterCard: 'summary_large_image',
  twitterTitle: () => 'Freyja後台 | 房型管理',
})
</script>

<template>
  <h1 class="fs-3 mt-3">
    房型管理
  </h1>
  <div class="card my-1 my-lg-4 shadow-sm">
    <div class="card-header">
      <div class="text-end py-2">
        <NuxtLink class="btn btn-primary text-light" to="/admin/rooms/new">
          <span class="bi bi-plus" />
          建立新的房型
        </NuxtLink>
      </div>
    </div>

    <div class="card-body">
      <table class="table table-hover">
        <thead class="bg-light">
          <tr class="align-middle">
            <th>房型名稱</th>
            <th>坪數</th>
            <th>床型</th>
            <th>
              售價<span class="bi bi-arrow-down-up ms-1" />
            </th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="room in roomsList" :key="room._id">
            <td>{{ room.name }}</td>
            <td>{{ room.areaInfo }}</td>
            <td>{{ room.bedInfo }}</td>
            <td>NT${{ $formatPrice(room.price) }}</td>
            <td>
              <span v-if="room.status === 1" class="text-primary">上架中</span>
              <span v-else class="text-coolgray">未上架</span>
            </td>
            <td>
              <div class="btn-group">
                <NuxtLink
                  class="btn btn-outline-primary btn-sm"
                  :to="`/admin/rooms/edit/${room._id}`"
                >
                  編輯
                </NuxtLink>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="handleDeleteRoom(room.name, room._id)"
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
