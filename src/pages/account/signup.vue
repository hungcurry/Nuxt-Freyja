<script setup lang="ts">
import type { TApiResponse } from '@/types/apiTypes'
import type { TUser, TUserRegister } from '@/types/dataTypes'
import { cityList, ZipCodeMap } from '@/utils/zipcodes'
import { Icon } from '@iconify/vue'

definePageMeta({
  name: 'signup',
  layout: 'registerlayout',
})

const isEmailAndPasswordValid = ref(false)
const isDisabled = ref(false)
const userRegisteObject = ref<TUserRegister>({
  address: {
    zipcode: '',
    county: '',
    district: '',
    detail: '',
  },
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  birthday: '',
  year: '',
  month: '',
  day: '',
  agreementCheck: false,
})
const { notifyWarn, notifySuccess, notifyError } = useNotifications()
const districtList = computed(() => {
  const city = ZipCodeMap.find(city => city.name === userRegisteObject.value.address.county)
  return city?.districts
})

function handleCreation() {
  // 檢查必填欄位
  if (!userRegisteObject.value.email || !userRegisteObject.value.password) {
    notifyWarn('請填寫信箱及密碼')
    return
  }
  // 檢查密碼格式
  const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/i
  if (!passwordRegex.test(userRegisteObject.value.password)) {
    notifyWarn('密碼需至少8位數，並包含英文字母和數字')
    return
  }
  // 檢查密碼確認
  if (userRegisteObject.value.password !== userRegisteObject.value.confirmPassword) {
    notifyWarn('密碼與確認密碼不相符')
    return
  }
  isEmailAndPasswordValid.value = true
}
async function handelRegister() {
  isDisabled.value = true

  const fullAddress = `${userRegisteObject.value.address.county}${userRegisteObject.value.address.district}${userRegisteObject.value.address.detail}`
  const fullBirthday = `${userRegisteObject.value.year}/${userRegisteObject.value.month}/${userRegisteObject.value.day}`
  if (fullBirthday) {
    userRegisteObject.value.birthday = fullBirthday
  }
  // 設定郵遞區號 / 組合地址
  if (districtList.value?.length) {
    const district = districtList.value.find(district => district.name === userRegisteObject.value.address.district)
    if (district) {
      userRegisteObject.value.address.zipcode = district.zip
    }
  }
  // 檢查必填欄位
  if (!userRegisteObject.value.name
    || !userRegisteObject.value.email
    || !userRegisteObject.value.password
    || !userRegisteObject.value.phone
    || !userRegisteObject.value.birthday
    || !userRegisteObject.value.address.zipcode
    || !userRegisteObject.value.address.detail
    || !userRegisteObject.value.agreementCheck) {
    notifyWarn('請填寫所有必填欄位')
    isDisabled.value = false
    return
  }

  const userRegiste = {
    name: userRegisteObject.value.name,
    email: userRegisteObject.value.email,
    password: userRegisteObject.value.password,
    phone: userRegisteObject.value.phone,
    birthday: fullBirthday,
    address: {
      zipcode: String(userRegisteObject.value.address.zipcode),
      detail: fullAddress,
    },
  }
  // console.log('userRegiste', userRegiste)

  try {
    const response = await $fetch<TApiResponse<TUser>>('/v1/user/signup', {
      baseURL: 'https://nuxr3.zeabur.app/api',
      method: 'POST',
      body: userRegiste,
    })
    if (response.status) {
      await notifySuccess('註冊成功')
      userRegisteObject.value = {
        address: {
          zipcode: '',
          county: '',
          district: '',
          detail: '',
        },
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        birthday: '',
        year: '',
        month: '',
        day: '',
        agreementCheck: false,
      }
      navigateTo('/account/login')
    }
  }
  catch (error: unknown) {
    console.log('error', (error as any).response?._data)
    const errorMessage = (error as any).response?._data?.message || '註冊失敗'
    notifyError(errorMessage)
  }
  finally {
    isDisabled.value = false
  }
}
</script>

<template>
  <div class="p-5 px-md-0 py-md-30">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">
        立即註冊
      </h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{ 'd-none': isEmailAndPasswordValid }"
            class="step p-2 bg-primary-100 rounded-circle"
          >1</span>
          <Icon
            :class="{ 'd-none': !isEmailAndPasswordValid }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            icon="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">
            輸入信箱及密碼
          </p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100">

        <div
          :class="{
            'text-neutral-0': isEmailAndPasswordValid, 'text-neutral-60': !isEmailAndPasswordValid,
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': isEmailAndPasswordValid, 'bg-transparent border border-neutral-60': !isEmailAndPasswordValid,
            }"
            class="step p-2 rounded-circle"
          >2</span>
          <p class="mb-0 fs-8 fs-md-7 fw-bold">
            填寫基本資料
          </p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <!-- 步驟1 -->
      <form
        :class="{ 'd-none': isEmailAndPasswordValid }"
        class="mb-4"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="email"
          >
            電子信箱
          </label>
          <input
            id="email"
            v-model="userRegisteObject.email"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            placeholder="hello@exsample.com"
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
            v-model="userRegisteObject.password"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            placeholder="請輸入密碼"
            type="password"
            autocomplete="new-password"
          >
        </div>
        <div class="mb-10 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="confirmPassword"
          >
            確認密碼
          </label>
          <input
            id="confirmPassword"
            v-model="userRegisteObject.confirmPassword"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            placeholder="請再輸入一次密碼"
            type="password"
            autocomplete="new-password"
          >
        </div>

        <button
          class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
          type="button"
          @click="handleCreation"
        >
          下一步
        </button>
      </form>

      <!-- 步驟2 -->
      <form
        :class="{ 'd-none': !isEmailAndPasswordValid }"
        class="mb-4"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="name"
          >
            姓名
          </label>
          <input
            id="name"
            v-model="userRegisteObject.name"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40  rounded-3"
            placeholder="請輸入姓名"
            type="text"
            autocomplete="name"
          >
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="phone"
          >
            手機號碼
          </label>
          <input
            id="phone"
            v-model="userRegisteObject.phone"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40  rounded-3"
            placeholder="請輸入手機號碼"
            type="tel"
            autocomplete="off"
          >
        </div>

        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="birth"
          >
            生日
          </label>
          <div class="d-flex gap-2">
            <select
              id="birth"
              v-model="userRegisteObject.year"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              autocomplete="bday-year"
            >
              <option
                v-for="year in 65"
                :key="year"
                :value="`${year + 1958}`"
              >
                {{ year + 1958 }} 年
              </option>
            </select>
            <select
              v-model="userRegisteObject.month"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              autocomplete="bday-month"
            >
              <option
                v-for="month in 12"
                :key="month"
                :value="`${month}`"
              >
                {{ month }} 月
              </option>
            </select>
            <select
              v-model="userRegisteObject.day"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              autocomplete="bday-day"
            >
              <option
                v-for="day in 30"
                :key="day"
                :value="`${day}`"
              >
                {{ day }} 日
              </option>
            </select>
          </div>
        </div>

        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="form-label text-neutral-0 fw-bold"
            for="address"
          >
            地址
          </label>
          <div class="d-flex flex-column gap-2">
            <div class="d-flex gap-2 mb-2">
              <select
                v-model="userRegisteObject.address.county"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                autocomplete="address-level1"
              >
                <option selected disabled>
                  請選擇縣市
                </option>
                <option v-for="city in cityList" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
              <select
                v-model="userRegisteObject.address.district"
                name="行政區"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                autocomplete="address-level2"
              >
                <option selected disabled>
                  請選擇行政區
                </option>
                <option
                  v-for="district in districtList"
                  :key="district.zip"
                  :value="district.name"
                >
                  {{ district.name }}
                </option>
              </select>
            </div>
            <input
              id="address"
              v-model="userRegisteObject.address.detail"
              type="text"
              class="form-control p-4 rounded-3"
              placeholder="請輸入詳細地址"
              autocomplete="street-address"
            >
          </div>
        </div>
        <div class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0">
          <input
            id="agreementCheck"
            v-model="userRegisteObject.agreementCheck"
            class="form-check-input"
            type="checkbox"
            value=""
          >
          <label
            class="form-check-label fw-bold"
            for="agreementCheck"
          >
            我已閱讀並同意本網站個資使用規範
          </label>
        </div>

        <button
          :disabled="isDisabled"
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="button"
          @click="handelRegister"
        >
          完成註冊
        </button>
      </form>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>立即登入</span>
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

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>
