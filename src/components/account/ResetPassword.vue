<script setup lang="ts">
import type { TApiGenericResponse } from '@/types/apiTypes'
import { FetchError } from 'ofetch'

const userEmail = ref()
const isSendCode = ref(false)
const generateEmailCode = ref()
const newPassword = ref()
const { notifyWarn, notifySuccess, notifyError } = useNotifications()
const { public: { apiBaseUrl } } = useRuntimeConfig()

// 驗證信箱
async function handleValidateEmail() {
  try {
    const response = await $fetch<TApiGenericResponse<any>>('/verify/email', {
      baseURL: apiBaseUrl,
      method: 'POST',
      body: {
        email: userEmail.value,
      },
    })
    if (response.result?.isEmailExists) {
      notifySuccess('信箱驗證成功')
      handleSendEmailCode()
    }
    else {
      notifyError('信箱驗證失敗')
    }
  }
  catch (error) {
    if (error instanceof FetchError) {
      const { message } = error.response?._data
      notifyError(message)
    }
  }
}
// 傳送信箱驗證碼
async function handleSendEmailCode() {
  try {
    const response = await $fetch('/verify/generateEmailCode', {
      baseURL: apiBaseUrl,
      method: 'POST',
      body: {
        email: userEmail.value,
      },
    })
    notifySuccess('已傳送驗證碼')
    isSendCode.value = true
  }
  catch (error) {
    if (error instanceof FetchError) {
      const { message } = error.response?._data
      notifyError(message)
    }
  }
}
// 更改密碼
async function handleResetPassword() {
  try {
    await $fetch('/user/forgot', {
      baseURL: apiBaseUrl,
      method: 'POST',
      body: {
        email: userEmail.value,
        code: generateEmailCode.value,
        newPassword: newPassword.value,
      },
    })

    notifySuccess('密碼已更改')
    navigateTo('/account/login')
  }
  catch (error) {
    if (error instanceof FetchError) {
      const { message } = error.response?._data
      notifyError(message)
    }
  }
}
// seo
useSeoMeta({
  title: () => 'Freyja | 忘記密碼',
  ogTitle: () => 'Freyja | 忘記密碼',
  twitterCard: 'summary_large_image',
  twitterTitle: () => 'Freyja | 忘記密碼',
})
</script>

<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <h1 class="text-neutral-0 fw-bold">
        忘記密碼
      </h1>
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        請輸入電子信箱，<br>我們將寄送驗證碼至您的電子信箱
      </p>
    </div>

    <form class="mb-5">
      <div v-if="!isSendCode" class="mb-4 fs-8 fs-md-7">
        <label class="mb-2 text-neutral-0 fw-bold" for="email">
          電子信箱
        </label>
        <input
          id="email"
          v-model="userEmail"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入信箱"
          type="email"
        >
        <button
          class="btn btn-primary-100 w-100 mt-5 py-4 text-neutral-0 fw-bold"
          type="button"
          :disabled="userEmail === null"
          @click="handleValidateEmail()"
        >
          傳送驗證碼
        </button>
      </div>

      <div v-if="isSendCode" class="mb-4 fs-8 fs-md-7">
        <label class="mb-2 text-neutral-0 fw-bold" for="generateEmailCode">
          驗證碼
        </label>
        <input
          id="generateEmailCode"
          v-model="generateEmailCode"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入驗證碼"
          type="password"
        >
        <label
          class="mt-4 text-neutral-0 fw-bold"
          for="newPassword"
        >新密碼
        </label>
        <input
          id="newPassword"
          v-model="newPassword"
          class="form-control mt-2 p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入新密碼"
          type="password"
        >
        <button
          class="btn btn-primary-100 w-100 mt-5 py-4 text-neutral-0 fw-bold"
          type="button"
          @click="handleResetPassword"
        >
          更改密碼
        </button>
      </div>
    </form>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">沒有會員嗎？</span>
      <NuxtLink
        to="/account/signup"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>前往註冊</span>
      </NuxtLink>
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

input[type="password"] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
}
</style>
