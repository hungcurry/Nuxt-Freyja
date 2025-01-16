<script setup lang="ts">
import type { TApiGenericResponse } from '@/types/apiTypes'
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
const { data: orderList, refresh } = await useFetch('/admin/orders', {
  baseURL: apiBaseUrl,
  method: 'GET',
  headers: {
    Authorization: token.value ?? '',
  },
  transform: (response: TApiGenericResponse<any[]>) => {
    const { result } = response
    if (result) {
      return result.filter(order => order.status === 0) || {}
    }
    return []
  },
  onResponseError({ response }) {
    const { message } = response?._data
    console.error('Error', message)
    navigateTo('/')
  },
})
function countDateDiffs(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return Math.floor(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
}
async function handleDeleteOrder(id: string) {
  try {
    const swalOptions = {
      title: '即將刪除訂單',
      text: '確定要刪除此訂單嗎？',
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

    const response = await $fetch<TApiGenericResponse<any>>(`/admin/orders/${id}`, {
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
  title: () => 'Freyja後台 | 訂單管理',
  ogTitle: () => 'Freyja後台 | 訂單管理',
  twitterCard: 'summary_large_image',
  twitterTitle: () => 'Freyja後台 | 訂單管理',
})
</script>

<template>
  <h1 class="fs-3 mt-3">
    訂單管理
  </h1>
  <small>Breadcrumb: {{ route.fullPath }}</small>
  <div class="overflow-x-auto">
    <div class="min-w-960px mx-auto card my-1 my-lg-4 shadow-sm">
      <div class="card-body">
        <table class="table table-hover">
          <thead class="bg-light">
            <tr class="align-middle">
              <th>訂單編號</th>
              <th>訂購房型</th>
              <th>訂購人</th>
              <th>入住時間</th>
              <th>退房時間</th>
              <th>
                金額
                <span class="bi bi-arrow-down-up ms-1" />
              </th>
              <th>操作</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="order in orderList" :key="order._id">
              <td>{{ order._id }}</td>
              <td>{{ order.roomId.name }}</td>
              <td>{{ order.userInfo.name }}</td>
              <td><span v-timeFormat="order.checkInDate" /></td>
              <td><span v-timeFormat="order.checkOutDate" /></td>
              <td>
                <span>NT$
                  {{
                    $formatPrice(
                      order.roomId.price
                        * countDateDiffs(order.checkInDate, order.checkOutDate),
                    )
                  }}</span>
              </td>
              <td>
                <div class="btn-group">
                  <NuxtLink
                    class="btn btn-outline-primary btn-sm"
                    :to="`/admin/orders/edit/${order._id}`"
                  >
                    編輯
                  </NuxtLink>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="handleDeleteOrder(order._id)"
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
  </div>
</template>

<style scoped lang="scss">
</style>
