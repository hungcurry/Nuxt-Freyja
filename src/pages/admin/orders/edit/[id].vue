<script setup lang="ts">
import type { TApiGenericResponse } from '@/types/apiTypes'
import dayjs from 'dayjs'
import { FetchError } from 'ofetch'

definePageMeta({
  layout: 'adminlayout',
  middleware: ['admin-auth'],
})

const route = useRoute()
const router = useRouter()
const token = useCookie<string | null>('Freyja-token')
const { $swal } = useNuxtApp()
const { formatDate } = useDateRange()
const { notifyWarn, notifySuccess, notifyError } = useNotifications()
const { $formatPrice } = useNuxtApp()
const { public: { apiBaseUrl } } = useRuntimeConfig()
const { id } = route.params

// SSR
const { data: orderList } = await useFetch('/admin/orders', {
  baseURL: apiBaseUrl,
  method: 'GET',
  headers: {
    Authorization: token.value ?? '',
  },
  transform: (response: TApiGenericResponse<any[]>) => {
    const { result } = response || {}
    if (result) {
      const orderList = result.filter((order) => {
        return order._id === id
      })
      return orderList[0]
    }
    return null
  },
  onResponseError({ response }) {
    const { message } = response?._data
    console.error('Error', message)
    navigateTo('/')
  },
})
const editOrderList = computed(() => {
  if (!orderList.value)
    return null
  return {
    ...orderList.value,
    roomId: orderList.value.roomId._id,
    checkInDate: formatDate(new Date(orderList.value.checkInDate)),
    checkOutDate: formatDate(new Date(orderList.value.checkOutDate)),
  }
})

function handleGoBack() {
  router.go(-1)
}
async function handleEditOrder(id: string) {
  try {
    await $fetch(`/admin/orders/${id}`, {
      baseURL: apiBaseUrl,
      method: 'PUT',
      headers: {
        Authorization: token.value ?? '',
      },
      body: {
        ...editOrderList.value,
      },
    })

    notifySuccess('修改成功')
    navigateTo('/admin/orders')
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
  title: () => 'Freyja後台 | 編輯訂單',
  ogTitle: () => 'Freyja後台 | 編輯訂單',
  twitterCard: 'summary_large_image',
  twitterTitle: () => 'Freyja後台 | 編輯訂單',
})
</script>

<template>
  <div class="container">
    <VForm v-slot="{ errors, meta }">
      <h1 class="fs-3 mt-3">
        訂單編號 - {{ orderList._id }}
      </h1>
      <div class="mx-auto">
        <div v-if="orderList" class="roomInfo card mt-4 shadow-sm">
          <div class="card-header">
            <h5 class="my-1">
              訂房資訊
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">房型名稱</label>
              <p class="text-primary">
                {{ orderList.roomId.name }}
              </p>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label class="form-label">坪數</label>
                <p class="text-primary">
                  {{ orderList.roomId.areaInfo }}
                </p>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">床型資訊</label>
                <p class="text-primary">
                  {{ orderList.roomId.bedInfo }}
                </p>
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label class="form-label">入住人數</label>
                <p class="text-primary">
                  {{ orderList.peopleNum }} 人
                </p>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">入住價格 / 一晚</label>
                <p class="text-primary">
                  NT $ {{ $formatPrice(orderList.roomId.price) }}
                </p>
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label class="form-label">入住時間</label>
                <p class="text-primary">
                  <span v-timeFormat="orderList.checkInDate" />
                </p>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">退房時間</label>
                <p class="text-primary">
                  <span v-timeFormat="orderList.checkOutDate" />
                </p>
              </div>
            </div>
            <NuxtLink
              class="btn btn-primary"
              :to="`/admin/rooms/edit/${orderList.roomId._id}`"
            >
              前往查看 / 編輯房型詳細
            </NuxtLink>
          </div>
        </div>

        <div v-if="editOrderList" class="userInfo card mt-4 shadow-sm">
          <div class="card-header">
            <h5 class="my-1">
              訂購人資訊
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="username" class="form-label">*訂購人姓名</label>
              <VField
                id="username"
                v-model="editOrderList.userInfo.name"
                name="訂購人姓名"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['訂購人姓名'] }"
                placeholder="請輸入訂購人姓名"
                rules="required|username"
              />
              <VErrorMessage name="訂購人姓名" class="invalid-feedback" />
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="userPhone" class="form-label">*訂購人電話</label>
                <VField
                  id="userPhone"
                  v-model="editOrderList.userInfo.phone"
                  name="訂購人電話"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['訂購人電話'] }"
                  rules="required|phone"
                  placeholder="請輸入訂購人電話"
                />
                <VErrorMessage name="訂購人電話" class="invalid-feedback" />
              </div>
              <div class="mb-3 col-md-6">
                <label for="userEmail" class="form-label">*訂購人信箱</label>
                <VField
                  id="userEmail"
                  v-model="editOrderList.userInfo.email"
                  name="訂購人信箱"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['訂購人信箱'] }"
                  rules="required|email"
                  placeholder="請輸入訂購人信箱"
                />
                <VErrorMessage name="訂購人信箱" class="invalid-feedback" />
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label
                  for="userZipCode"
                  class="form-label"
                >*訂購人郵遞區號</label>
                <VField
                  id="userZipCode"
                  v-model.number="editOrderList.userInfo.address.zipcode"
                  name="訂購人郵遞區號"
                  type="number"
                  min="1"
                  class="form-control"
                  :class="{ 'is-invalid': errors['訂購人郵遞區號'] }"
                  rules="required"
                  placeholder="請輸入訂購人郵遞區號"
                />
                <VErrorMessage name="訂購人郵遞區號" class="invalid-feedback" />
              </div>
              <div class="mb-3 col-md-6">
                <label
                  for="userAddressDetail"
                  class="form-label"
                >*訂購人詳細地址</label>
                <VField
                  id="userAddressDetail"
                  v-model="editOrderList.userInfo.address.detail"
                  name="訂購人詳細地址"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['訂購人詳細地址'] }"
                  rules="required"
                  placeholder="請輸入訂購人詳細地址"
                />
                <VErrorMessage name="訂購人詳細地址" class="invalid-feedback" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-end mt-3 mb-5">
        <button
          type="button"
          class="btn btn-outline-secondary mx-2"
          @click="handleGoBack"
        >
          取消
        </button>
        <button
          type="button"
          class="btn btn-primary text-light"
          :disabled="!meta.valid"
          @click="handleEditOrder(orderList._id)"
        >
          確認修改
        </button>
      </div>
    </VForm>
  </div>
</template>

<style scoped lang="scss">
</style>
