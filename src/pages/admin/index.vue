<script setup lang="ts">
import type { TApiGenericResponse, TApiNewsItem } from '@/types/apiTypes'

definePageMeta({
  layout: 'adminlayout',
  middleware: 'admin-auth',
})

const route = useRoute()
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
// seo
useSeoMeta({
  title: () => 'Freyja後台 | 首頁',
  ogTitle: () => 'Freyja後台 | 首頁',
  twitterCard: 'summary_large_image',
  twitterTitle: () => 'Freyja後台 | 首頁',
})
</script>

<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="fs-3 mt-3">
          最新消息總覽
        </h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item">
              {{ route.fullPath }}
            </li>
          </ol>
        </nav>
      </div>
      <button class="btn btn-primary">
        <i class="bi bi-plus-lg me-1" />
        通知
      </button>
    </div>

    <div class="row g-4">
      <div v-for="news in newsList" :key="news._id" class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
          <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center p-3">
            <h5 class="card-title mb-0 fw-bold">
              {{ news.title }}
            </h5>
            <img
              :src="news.image"
              :alt="news.title"
              class="rounded-3 object-fit-cover"
              style="width: 80px; height: 80px;"
            >
          </div>
          <div class="card-body px-3">
            <p class="card-text">
              {{ news.description }}
            </p>
          </div>
          <div class="card-footer bg-white border-0 px-3 pb-3">
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                <i class="bi bi-calendar3 me-1" />
                {{ new Date(news.createdAt).toLocaleDateString() }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 統計資訊區塊 -->
    <div class="row g-4 mt-4">
      <div class="col-md-4">
        <div class="card border-0 bg-gradient shadow-sm h-100 overflow-hidden position-relative">
          <div class="card-body p-4">
            <div class="d-flex align-items-center mb-3">
              <div class="rounded-circle bg-blue-100 p-3 me-3">
                <i class="bi bi-cart fs-4 text-blue-600" />
              </div>
              <h5 class="card-title mb-0 text-blue-600">
                本月訂單總數
              </h5>
            </div>
            <p class="display-4 fw-bold text-blue-600 mb-2">
              152
            </p>
            <p class="mb-0 text-blue-500">
              <i class="bi bi-arrow-up-right me-1" />
              較上月增加 12%
            </p>
          </div>
          <div class="position-absolute top-0 end-0 opacity-10">
            <i class="bi bi-cart display-1" />
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 bg-gradient shadow-sm h-100 overflow-hidden position-relative">
          <div class="card-body p-4">
            <div class="d-flex align-items-center mb-3">
              <div class="rounded-circle bg-primary-100 p-3 me-3">
                <i class="bi bi-currency-dollar fs-4 text-primary" />
              </div>
              <h5 class="card-title mb-0 text-primary">
                本月營業額
              </h5>
            </div>
            <p class="display-4 fw-bold text-primary mb-2">
              $458,320
            </p>
            <p class="mb-0 text-primary-emphasis">
              <i class="bi bi-arrow-up-right me-1" />
              較上月增加 8%
            </p>
          </div>
          <div class="position-absolute top-0 end-0 opacity-10">
            <i class="bi bi-currency-dollar display-1" />
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 bg-gradient shadow-sm h-100 overflow-hidden position-relative">
          <div class="card-body p-4">
            <div class="d-flex align-items-center mb-3">
              <div class="rounded-circle bg-violet-100 p-3 me-3">
                <i class="bi bi-people fs-4 text-violet-600" />
              </div>
              <h5 class="card-title mb-0 text-violet-600">
                本月訪客數
              </h5>
            </div>
            <p class="display-4 fw-bold text-violet-600 mb-2">
              2,841
            </p>
            <p class="mb-0 text-violet-500">
              <i class="bi bi-arrow-up-right me-1" />
              較上月增加 15%
            </p>
          </div>
          <div class="position-absolute top-0 end-0 opacity-10">
            <i class="bi bi-people display-1" />
          </div>
        </div>
      </div>
    </div>

    <!-- 近期活動區塊 -->
    <div class="card border-0 shadow-sm mt-4">
      <div class="card-header bg-white py-3 border-0">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 fw-bold">
            <i class="bi bi-calendar-event me-2" />
            近期活動
          </h5>
          <button class="btn btn-outline-primary btn-sm">
            <i class="bi bi-plus-lg me-1" />
            通知
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="bg-light">
              <tr>
                <th class="border-0 py-3">
                  活動名稱
                </th>
                <th class="border-0 py-3">
                  日期
                </th>
                <th class="border-0 py-3">
                  地點
                </th>
                <th class="border-0 py-3">
                  狀態
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="py-3">
                  夏季泳池派對
                </td>
                <td class="py-3">
                  2024/07/15
                </td>
                <td class="py-3">
                  戶外泳池區
                </td>
                <td class="py-3">
                  <span class="badge rounded-pill bg-blue-100 text-blue-600 px-3">籌備中</span>
                </td>
              </tr>
              <tr>
                <td class="py-3">
                  美食品酒會
                </td>
                <td class="py-3">
                  2024/08/20
                </td>
                <td class="py-3">
                  宴會廳
                </td>
                <td class="py-3">
                  <span class="badge rounded-pill bg-primary-100 text-primary px-3">報名中</span>
                </td>
              </tr>
              <tr>
                <td class="py-3">
                  中秋賞月活動
                </td>
                <td class="py-3">
                  2024/09/15
                </td>
                <td class="py-3">
                  空中花園
                </td>
                <td class="py-3">
                  <span class="badge rounded-pill bg-violet-100 text-violet-600 px-3">規劃中</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hover-shadow {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
}

.transition-all {
  transition: all 0.3s ease;
}

.bg-gradient {
  background: linear-gradient(135deg, var(--bs-card-bg) 0%, rgba(255,255,255,0.9) 100%);
}
</style>
