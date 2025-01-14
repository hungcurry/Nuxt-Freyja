<script setup lang="ts">
import type { TApiGenericResponse, TApiUser } from '@/types/apiTypes'
import type { TRememberMe } from '@/types/dataTypes'
import { FetchError } from 'ofetch'

type TProps = {
  status?: boolean
  title?: string
}
const {
  status: propsStatus = false,
  title: propsTitle = '立即開始旅程',
} = defineProps<TProps>()

const bookingStore = useBookingStore()
const isDisabled = ref(false)
const isChecked = ref(false)
const userLoginObject = ref({
  email: '',
  password: '',
})
const { notifyWarn, notifySuccess, notifyError } = useNotifications()
const { bookingInfo } = storeToRefs(bookingStore)
const { public: { apiBaseUrl } } = useRuntimeConfig()

function handleGoToReset() {
  navigateTo('/account/reset')
}
async function handelLogin() {
  if (!userLoginObject.value.email
    || !userLoginObject.value.password
    || !isChecked.value) {
    notifyWarn('請輸入必要資訊')
    return
  }

  isDisabled.value = true
  try {
    const response = await $fetch<TApiGenericResponse<TApiUser>>('/user/login', {
      baseURL: apiBaseUrl,
      method: 'POST',
      body: userLoginObject.value,
    })

    if (response.status) {
      console.log('登入成功response', response)
      const { status, token, result } = response
      const auth = useCookie('Freyja-token', { maxAge: 21600 })
      auth.value = token

      const rememberMe = useCookie<TRememberMe>('Freyja-auth', { maxAge: 21600 })
      const remember = {
        email: userLoginObject.value.email,
        password: userLoginObject.value.password,
      }
      rememberMe.value = remember
      await notifySuccess('登入成功')

      // 如果已經有訂房資料，則跳轉到訂房頁面
      if (bookingInfo.value) {
        const { roomId } = bookingInfo.value
        navigateTo(`/rooms/${roomId}/booking`)
      }
      else {
        navigateTo('/')
      }
    }
  }
  catch (error) {
    if (error instanceof FetchError) {
      console.error('Fetch failed:', error.response?._data)
      const errorMessage = error.response?._data?.message || '登入失敗'
      notifyError(errorMessage)
    }
  }
  finally {
    isDisabled.value = false
    isChecked.value = false
    userLoginObject.value = {
      email: '',
      password: '',
    }
  }
}
async function handleRememberMe() {
  const rememberMe = useCookie<TRememberMe | null>('Freyja-auth')
  if (rememberMe.value === undefined)
    return

  try {
    if (rememberMe.value) {
      isChecked.value = true
      userLoginObject.value = JSON.parse(JSON.stringify(rememberMe.value))
    }
    else {
      isChecked.value = false
    }
  }
  catch (error) {
    console.error('解析 Cookie 時發生錯誤:', error)
    notifyWarn('登入資訊已過期，請重新登入')
    rememberMe.value = null
  }
}

onMounted(async () => {
  await handleRememberMe()
})
</script>

<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <p
        class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold"
      >
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="text-neutral-0 fw-bold">
        {{ propsTitle }}
      </h1>
    </div>

    <form class="mb-10">
      <div class="mb-4 fs-8 fs-md-7">
        <label
          class="mb-2 text-neutral-0 fw-bold"
          for="email"
        >
          電子信箱
        </label>
        <input
          id="email"
          v-model="userLoginObject.email"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入信箱"
          type="email"
          autocomplete="username"
        >
      </div>
      <div class="mb-4 fs-8 fs-md-7">
        <label
          class="mb-2 text-neutral-0 fw-bold"
          for="password"
        >
          密碼
        </label>
        <input
          id="password"
          v-model="userLoginObject.password"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入密碼"
          type="password"
          autocomplete="current-password"
        >
      </div>
      <div class="d-flex justify-content-between align-items-center mb-10 fs-8 fs-md-7">
        <div class="form-check d-flex align-items-end gap-2 text-neutral-0">
          <input
            id="remember"
            v-model="isChecked"
            class="form-check-input"
            type="checkbox"
          >
          <label
            class="form-check-label fw-bold"
            for="remember"
          >
            記住帳號
          </label>
        </div>
        <button
          class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
          type="button"
          @click="handleGoToReset"
        >
          忘記密碼？
        </button>
      </div>
      <button
        class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
        type="button"
        @click="handelLogin"
      >
        會員登入
      </button>
    </form>

    <p v-if="!propsStatus" class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">沒有會員嗎？</span>
      <NuxtLink
        to="signup"
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
  xxxl: 1537px
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
  background-color: #BF9D7D;
  border-color: #BF9D7D;
}
</style>
  