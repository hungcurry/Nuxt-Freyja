<script setup lang="ts">
import type { TRememberMe, TUserRegister } from '@/types/dataTypes'
import { cityList, ZipCodeMap } from '@/utils/zipcodes'

definePageMeta({
  name: 'user-profile',
  middleware: ['account-auth'],
})

const auth = useCookie<TRememberMe>('Freyja-auth')
const userStore = useUserStore()
const isEditPassword = ref(false)
const isEditProfile = ref(false)
const passwordForm = ref({
  email: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const profileForm = ref<TUserRegister>({
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
})
const { userInfo } = storeToRefs(userStore)
const { notifySuccess, notifyWarn, notifyError } = useNotifications()
const { formatDate } = useDateRange()
const districtList = computed(() => {
  const city = ZipCodeMap.find(city => city.name === profileForm.value.address.county)
  return city?.districts
})
const fullAddress = computed(() => {
  return `${profileForm.value.address.county} ${profileForm.value.address.district} ${profileForm.value.address.detail}`
})
const fullBirthday = computed(() => {
  return `${profileForm.value.year}/${profileForm.value.month}/${profileForm.value.day}`
})

async function handleSavePassword() {
  const { newPassword, confirmPassword, oldPassword } = passwordForm.value

  if (!newPassword || !confirmPassword || !oldPassword) {
    notifyWarn('密碼不能為空')
    return
  }

  if (newPassword !== confirmPassword) {
    notifyWarn('密碼不一致')
    return
  }

  const sendObj = {
    email: passwordForm.value.email,
    code: '0Zvjde',
    newPassword,
  }
  // try {
  //   const response = await $fetch<TApiGenericResponse<any>>('/v1/user/forgot', {
  //     baseURL: 'https://nuxr3.zeabur.app/api',
  //     method: 'POST',
  //     body: sendObj,
  //   })

  //   if (response.status) {
  //     console.log('response', response)
  //   }
  // }
  // catch (error) {
  //   if (error instanceof FetchError) {
  //     console.error('Fetch failed:', error.response?._data)
  //     const errorMessage = error.response?._data?.message || '登入失敗'
  //     notifyError(errorMessage)
  //   }
  // }
  // finally {
  //   passwordForm.value.newPassword = ''
  //   passwordForm.value.confirmPassword = ''
  // }
  passwordForm.value.oldPassword = sendObj.newPassword
  notifySuccess('密碼已更新')
  isEditPassword.value = !isEditPassword.value
}

async function handleSaveProfile() {
  const { name, phone, birthday } = profileForm.value

  if (!name || !phone || !birthday) {
    notifyWarn('資料不能為空')
    return
  }

  if (fullBirthday.value)
    profileForm.value.birthday = fullBirthday.value

  // 設定郵遞區號 / 組合地址
  if (districtList.value?.length) {
    const district = districtList.value.find(district => district.name === profileForm.value.address.district)
    if (district)
      profileForm.value.address.zipcode = district.zip
  }

  const sendObj = {
    name,
    phone,
    birthday: profileForm.value.birthday,
    address: profileForm.value.address,
  }
  // api get...
  notifySuccess('資料已更新')
  isEditProfile.value = !isEditProfile.value
}

if (auth.value) {
  const { email, password } = JSON.parse(JSON.stringify(auth.value))
  passwordForm.value.email = email
  passwordForm.value.oldPassword = password
}

// 監聽userInfo
watchEffect(() => {
  if (userInfo.value) {
    const {
      name,
      phone,
      birthday,
      address: { city, county, detail, zipcode },
    } = JSON.parse(JSON.stringify(userInfo.value))

    Object.assign(profileForm.value, {
      name,
      phone,
      birthday,
      address: {
        county: city,
        district: county,
        detail,
        zipcode,
      },
    })

    // 轉(YYYY/MM/DD)
    const [year, month, day] = formatDate(new Date(birthday)).split('-')
    profileForm.value.year = year
    profileForm.value.month = month
    profileForm.value.day = String(Number.parseInt(day, 10))
  }
})
</script>

<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-5">
      <div class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
        <h2 class="fs-6 fs-md-5 fw-bold">
          修改密碼
        </h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div class="Group fs-8 fs-md-7">
            <p class="mb-2 text-neutral-80 fw-medium">
              電子信箱
            </p>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
            >{{ passwordForm?.email }}</span>
          </div>

          <form v-if="!isEditPassword">
            <div class="d-flex justify-content-between align-items-center">
              <div class="Group">
                <input
                  type="text"
                  name="username"
                  autocomplete="username"
                  value="Jessica@exsample.com"
                  class="visually-hidden"
                >
                <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                  密碼
                </label>
                <input
                  v-model="passwordForm.oldPassword"
                  class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                  type="password"
                  autocomplete="current-password"
                >
              </div>

              <button
                class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
                type="button"
                @click="isEditPassword = !isEditPassword"
              >
                重設
              </button>
            </div>
          </form>

          <!-- edit -->
          <form
            v-else
            action="/password"
            method="POST"
            class="d-flex flex-column gap-4 gap-md-6"
          >
            <div class="Group">
              <input
                type="text"
                name="username"
                autocomplete="username"
                value="Jessica@exsample.com"
                class="visually-hidden"
              >
              <label
                for="oldPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
              >舊密碼</label>
              <input
                id="oldPassword"
                v-model="passwordForm.oldPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                placeholder="請輸入舊密碼"
                autocomplete="current-password"
              >
            </div>

            <div class="Group">
              <label
                for="newPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
              >新密碼</label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                placeholder="請輸入新密碼"
                autocomplete="new-password"
              >
            </div>

            <div class="Group">
              <label
                for="confirmPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
              >確認新密碼</label>
              <input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                placeholder="請再輸入一次新密碼"
                autocomplete="new-password"
              >
            </div>

            <button
              class="btn btn-primary-100 text-white align-self-md-start px-8 py-4 rounded-3"
              type="button"
              @click="handleSavePassword"
            >
              儲存設定
            </button>
          </form>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-7">
      <div class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
        <h2 class="fs-6 fs-md-5 fw-bold">
          基本資料
        </h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div v-if="!isEditProfile" class="d-flex flex-column gap-4 gap-md-6">
            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-medium text-neutral-80"
                for="name"
              >
                姓名
              </label>
              <input
                id="name"
                name="name"
                class="form-control text-neutral-100 fw-bold pe-none p-0 border-0"
                type="text"
                :value="profileForm?.name"
                autocomplete="name"
              >
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-medium text-neutral-80"
                for="phone"
              >
                手機號碼
              </label>
              <input
                id="phone"
                name="phone"
                class="form-control text-neutral-100 fw-bold pe-none p-0 border-0"
                type="tel"
                :value="profileForm?.phone"
                autocomplete="tel"
              >
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-medium text-neutral-80"
                for="birth"
              >
                生日
              </label>
              <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0">
                {{ formatDate(profileForm?.birthday ? new Date(profileForm.birthday) : new Date(), 8) }}
              </span>
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-medium text-neutral-80"
                for="address"
              >
                地址
              </label>
              <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0">
                {{ fullAddress }}
              </span>
            </div>

            <button
              class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
              type="button"
              @click="isEditProfile = !isEditProfile"
            >
              編輯
            </button>
          </div>

          <!-- edit -->
          <form
            v-else
            action="/info"
            method="POST"
            class="d-flex flex-column gap-4 gap-md-6"
          >
            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-bold text-neutral-100"
                for="name"
              >
                姓名
              </label>
              <input
                id="name"
                v-model="profileForm.name"
                name="name"
                class="form-control text-neutral-100 fw-bold p-4"
                type="text"
                autocomplete="name"
              >
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-bold text-neutral-100"
                for="phone"
              >
                手機號碼
              </label>
              <input
                id="phone"
                v-model="profileForm.phone"
                name="phone"
                class="form-control text-neutral-100 fw-bold p-4"
                type="tel"
                autocomplete="tel"
              >
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-bold text-neutral-100"
                for="birth"
              >
                生日
              </label>
              <div class="d-flex gap-2">
                <select
                  id="birth"
                  v-model="profileForm.year"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  autocomplete="bday-year"
                >
                  <option
                    v-for="year in 85"
                    :key="year"
                    :value="`${year + 1958}`"
                  >
                    {{ year + 1958 }} 年
                  </option>
                </select>
                <select
                  v-model="profileForm.month"
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
                  v-model="profileForm.day"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  autocomplete="bday-day"
                >
                  <option
                    v-for="day in 31"
                    :key="day"
                    :value="`${day}`"
                  >
                    {{ day }} 日
                  </option>
                </select>
              </div>
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-bold text-neutral-100"
                for="address"
              >
                地址
              </label>
              <div>
                <div class="d-flex gap-2 mb-2">
                  <select
                    v-model="profileForm.address.county"
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
                    v-model="profileForm.address.district"
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
                  v-model="profileForm.address.detail"
                  type="text"
                  class="form-control p-4 rounded-3"
                  placeholder="請輸入詳細地址"
                  autocomplete="street-address"
                >
              </div>
            </div>

            <button
              class="btn btn-primary-100 text-white align-self-md-start px-8 py-4 rounded-3"
              type="button"
              @click="handleSaveProfile"
            >
              儲存設定
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type="password"] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>
