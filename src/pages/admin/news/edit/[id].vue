<script setup lang="ts">
import type { TApiGenericResponse, TApiNewsItem } from '@/types/apiTypes'
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
const { data: newsList } = await useFetch('/admin/news', {
  baseURL: apiBaseUrl,
  method: 'GET',
  headers: {
    Authorization: token.value ?? '',
  },
  transform: (response: TApiGenericResponse<TApiNewsItem[]>) => {
    const { result } = response
    if (result) {
      const news = result.filter((news) => {
        return news._id === id
      })
      return news[0]
    }
    return null
  },
  onResponseError({ response }) {
    const { message } = response?._data
    console.error('Error', message)
    navigateTo('/')
  },
})
const editNewsList = computed(() => {
  if (!newsList.value)
    return null
  return {
    title: newsList.value.title,
    description: newsList.value.description,
    image: newsList.value.image,
    _id: newsList.value._id,
  }
})

function handleGoBack() {
  router.go(-1)
}
async function handleEditNews(id: string) {
  try {
    await $fetch(`/admin/news/${id}`, {
      baseURL: apiBaseUrl,
      method: 'PUT',
      headers: {
        Authorization: token.value ?? '',
      },
      body: {
        ...editNewsList.value,
      },
    })

    notifySuccess('修改成功')
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
  title: () => 'Freyja後台 | 編輯最新消息',
  ogTitle: () => 'Freyja後台 | 編輯最新消息',
  twitterCard: 'summary_large_image',
  twitterTitle: () => 'Freyja後台 | 編輯最新消息',
})
</script>

<template>
  <div class="container">
    <VForm v-if="editNewsList" v-slot="{ errors, meta }">
      <h1 class="fs-3 mt-3">
        最新消息 - 編輯
      </h1>
      <div class="mx-auto">
        <div class="card mt-4 shadow-sm">
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
                v-model="editNewsList.title"
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
                v-model="editNewsList.image"
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
                v-model="editNewsList.description"
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
          @click="handleEditNews(editNewsList._id)"
        >
          確認修改
        </button>
      </div>
    </VForm>
  </div>
</template>

<style scoped lang="scss">
</style>
