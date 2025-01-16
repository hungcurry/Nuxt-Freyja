<script setup lang="ts">
import type { TApiNewsItem } from '@/types/apiTypes'
import { FetchError } from 'ofetch'

definePageMeta({
  layout: 'adminlayout',
  middleware: ['admin-auth'],
})

const token = useCookie<string | null>('Freyja-token')
const router = useRouter()
const { $swal } = useNuxtApp()
const { notifyWarn, notifySuccess, notifyError } = useNotifications()
const { public: { apiBaseUrl } } = useRuntimeConfig()
const newNewsList = ref<TApiNewsItem>({
  _id: '',
  title: '',
  description: '',
  image: '',
  createdAt: '',
  updatedAt: '',
})

function handleGoBack() {
  router.go(-1)
}
async function handleAddNews() {
  try {
    await $fetch('/admin/news', {
      baseURL: apiBaseUrl,
      method: 'POST',
      headers: {
        Authorization: token.value ?? '',
      },
      body: {
        ...newNewsList.value,
      },
    })

    notifySuccess('新增成功')
    navigateTo('/admin/news')
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
  title: () => 'Freyja後台 | 新增最新消息',
  ogTitle: () => 'Freyja後台 | 新增最新消息',
  twitterCard: 'summary_large_image',
  twitterTitle: () => 'Freyja後台 | 新增最新消息',
})
</script>

<template>
  <div class="container">
    <VForm v-slot="{ errors, meta }">
      <h1 class="fs-3 mt-3">
        最新消息 - 新增
      </h1>
      <div class="mx-auto">
        <div class="newsInfo card mt-4 shadow-sm">
          <div class="card-header">
            <h5 class="my-1">
              基本資訊
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="title" class="form-label">*標題</label>
              <VField
                id="title"
                v-model="newNewsList.title"
                name="標題"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['標題'] }"
                placeholder="請輸入標題"
                rules="required"
              />
              <VErrorMessage name="標題" class="invalid-feedback" />
            </div>

            <div class="mb-3">
              <label for="image" class="form-label">*圖片</label>
              <VField
                id="image"
                v-model="newNewsList.image"
                name="圖片"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['圖片'] }"
                rules="required"
                placeholder="請輸入圖片"
              />
              <VErrorMessage name="圖片" class="invalid-feedback" />
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">*描述</label>
              <VField
                id="description"
                v-model="newNewsList.description"
                name="描述"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['描述'] }"
                rules="required"
                placeholder="請輸入描述"
                as="textarea"
              />
              <VErrorMessage name="描述" class="invalid-feedback" />
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
          @click="handleAddNews"
        >
          新增
        </button>
      </div>
    </VForm>
  </div>
</template>

<style scoped lang="scss">
</style>
