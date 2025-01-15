<script setup lang="ts">
import type { TApiGenericResponse, TApiRoomItem } from '@/types/apiTypes'
import { FetchError } from 'ofetch'

definePageMeta({
  layout: 'adminlayout',
  middleware: ['admin-auth'],
})

const route = useRoute()
const router = useRouter()
const token = useCookie<string | null>('Freyja-token')
const { $swal } = useNuxtApp()
const { notifyWarn, notifySuccess, notifyError } = useNotifications()
const { public: { apiBaseUrl } } = useRuntimeConfig()
const { id } = route.params

// SSR
const { data: roomList } = await useFetch('/admin/rooms', {
  baseURL: apiBaseUrl,
  method: 'GET',
  headers: {
    Authorization: token.value ?? '',
  },
  transform: (response: TApiGenericResponse<TApiRoomItem[]>) => {
    const { result } = response
    if (result) {
      const room = result.filter((room) => {
        return room._id === id
      })
      console.log('room', room)
      return room[0]
    }
    return null
  },
  onResponseError({ response }) {
    const { message } = response?._data
    console.error('Error', message)
    navigateTo('/')
  },
})

function handleGoBack() {
  router.go(-1)
}
function handleAddInput() {
  roomList.value?.imageUrlList.push('')
}
async function handleEditRoom(id: string) {
  try {
    await $fetch(`/admin/rooms/${id}`, {
      baseURL: apiBaseUrl,
      method: 'PUT',
      headers: {
        Authorization: token.value ?? '',
      },
      body: {
        ...roomList.value,
      },
    })

    notifySuccess('修改成功')
    navigateTo('/admin/rooms')
  }
  catch (error) {
    if (error instanceof FetchError) {
      const message = error.response?._data.message || '發生未知錯誤，請稍後再試'
      notifyError(message)
    }
  }
}
// seo
useSeoMeta({
  title: () => 'Freyja後台 | 編輯房型',
  ogTitle: () => 'Freyja後台 | 編輯房型',
  twitterCard: 'summary_large_image',
  twitterTitle: () => 'Freyja後台 | 編輯房型',
})
</script>

<template>
  <div class="container">
    <VForm v-if="roomList" v-slot="{ errors, meta }">
      <h1 class="fs-3 mt-3">
        房型 - 編輯
      </h1>
      <div class="mx-auto">
        <div class="imageInfo card mt-4 shadow-sm">
          <div class="card-header">
            <h5 class="my-1">
              圖片資訊
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="imageUrl" class="form-label">*房型主圖</label>
              <VField
                id="imageUrl"
                v-model="roomList.imageUrl"
                name="房型主圖"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['房型主圖'] }"
                placeholder="請輸入圖片連結"
                rules="required"
              />
              <VErrorMessage name="房型主圖" class="invalid-feedback" />
            </div>
            <div class="mb-3">
              <label
                for="imageUrl"
                class="form-label"
              >*房型其他圖片(請至少新增4張圖片)</label>
              <div
                v-for="(image, index) in roomList.imageUrlList"
                :key="index"
                class="mb-3"
              >
                <input
                  :id="`imageUrl-${index}`"
                  v-model="roomList.imageUrlList[index]"
                  type="text"
                  class="form-control"
                  :placeholder="`請輸入第 ${index + 1} 張圖片連結`"
                >
              </div>
              <button
                type="button"
                class="btn btn-primary d-block mt-3"
                @click="handleAddInput"
              >
                新增圖片
              </button>
            </div>
          </div>
        </div>
        <div class="baseInfo card mt-4 shadow-sm">
          <div class="card-header">
            <h5 class="my-1">
              基本資訊
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="name" class="form-label">*房型名稱</label>
              <VField
                id="name"
                v-model="roomList.name"
                name="房型名稱"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['房型名稱'] }"
                placeholder="請輸入房型名稱"
                rules="required"
              />
              <VErrorMessage name="房型名稱" class="invalid-feedback" />
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="areaInfo" class="form-label">*坪數</label>
                <VField
                  id="areaInfo"
                  v-model="roomList.areaInfo"
                  name="坪數"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['坪數'] }"
                  rules="required"
                  placeholder="請輸入房間坪數(ex.24坪)"
                />
                <VErrorMessage name="坪數" class="invalid-feedback" />
              </div>
              <div class="mb-3 col-md-6">
                <label for="bedInfo" class="form-label">*床型資訊</label>
                <VField
                  id="bedInfo"
                  v-model="roomList.bedInfo"
                  name="床型資訊"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['床型資訊'] }"
                  rules="required"
                  placeholder="請輸入床型資訊(ex.一張大床、兩張大床)"
                />
                <VErrorMessage name="床型資訊" class="invalid-feedback" />
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label
                  for="maxPeople"
                  class="form-label"
                >*可入住最多人數</label>
                <VField
                  id="maxPeople"
                  v-model.number="roomList.maxPeople"
                  name="可入住最多人數"
                  type="number"
                  min="1"
                  class="form-control"
                  :class="{ 'is-invalid': errors['可入住最多人數'] }"
                  rules="required||greaterThanZero"
                  placeholder="請輸入最多人數"
                />
                <VErrorMessage name="可入住最多人數" class="invalid-feedback" />
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">*入住價格 / 一晚</label>
                <VField
                  id="price"
                  v-model.number="roomList.price"
                  name="入住價格"
                  type="number"
                  min="0"
                  class="form-control"
                  :class="{ 'is-invalid': errors['入住價格'] }"
                  rules="required||greaterThanZero"
                  placeholder="請輸入入住價格"
                />
                <VErrorMessage name="入住價格" class="invalid-feedback" />
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-4">
                <label for="category" class="form-label">*房間格局</label>
                <div
                  v-for="(item, index) in roomList.layoutInfo"
                  :key="`layout-${index}`"
                  class="form-check"
                >
                  <input
                    :id="`layout-${index}`"
                    v-model="item.isProvide"
                    class="form-check-input"
                    type="checkbox"
                  >
                  <label class="form-check-label" :for="`layout-${index}`">
                    {{ item.title }}
                  </label>
                </div>
              </div>
              <div class="mb-3 col-md-4">
                <label for="price" class="form-label">*房內設備</label>
                <div
                  v-for="(item, index) in roomList.facilityInfo"
                  :key="`facility-${index}`"
                  class="form-check"
                >
                  <input
                    :id="`facility-${index}`"
                    v-model="item.isProvide"
                    class="form-check-input"
                    type="checkbox"
                  >
                  <label class="form-check-label" :for="`facility-${index}`">
                    {{ item.title }}
                  </label>
                </div>
              </div>
              <div class="mb-3 col-md-4">
                <label for="category" class="form-label">*備品提供</label>
                <div
                  v-for="(item, index) in roomList.amenityInfo"
                  :key="`amenity-${index}`"
                  class="form-check"
                >
                  <input
                    :id="`amenity-${index}`"
                    v-model="item.isProvide"
                    class="form-check-input"
                    type="checkbox"
                  >
                  <label class="form-check-label" :for="`amenity-${index}`">
                    {{ item.title }}
                  </label>
                </div>
              </div>
            </div>

            <hr>

            <div class="mb-3">
              <label for="description" class="form-label">*房型描述</label>
              <VField
                id="description"
                v-model="roomList.description"
                name="房型描述"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['房型描述'] }"
                rules="required"
                placeholder="請輸入房型描述"
                rows="16"
                as="textarea"
              />
              <VErrorMessage name="房型描述" class="invalid-feedback" />
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
          @click="handleEditRoom(roomList._id)"
        >
          確認修改
        </button>
      </div>
    </VForm>
  </div>
</template>

<style scoped lang="scss">
</style>
