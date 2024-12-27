<script setup lang="ts">
import type { TApiGenericResponse, TApiRoomItem } from '@/types/apiTypes'
import type { TUser } from '@/types/dataTypes'
import { cityList, ZipCodeMap } from '@/utils/zipcodes'
import { Icon } from '@iconify/vue'
import { FetchError } from 'ofetch'

definePageMeta({
  name: 'booking',
  middleware: ['account-auth'],
})

const bookingStore = useBookingStore()
const submitButtonRef = useTemplateRef('submitButtonRef')
const router = useRouter()
const route = useRoute()
const orderId = route.params.roomId
const isLoading = ref(false)
const userInfo = ref<TUser>({
  address: {
    zipcode: '',
    county: '',
    district: '',
    detail: '',
  },
  name: '',
  phone: '',
  email: '',
})
const { setOrderResult } = bookingStore
const { roomInfo, bookingInfo } = storeToRefs(bookingStore)
const { formatDateWeekday } = useDateRange()
const { notifyWarn } = useNotifications()

const discountPrice = computed(() => {
  const price = roomInfo.value?.price
  if (!price || price === 0)
    return 0
  return price / 10
})
const totalPrice = computed(() => {
  return (roomInfo.value?.price || 0) * (bookingInfo.value?.bookingDays || 0) - discountPrice.value
})
const districtList = computed(() => {
  const city = ZipCodeMap.find(city => city.name === userInfo.value.address.county)
  return city?.districts
})

function goBack() {
  router.back()
}
function resetUserForm() {
  userInfo.value = {
    address: {
      zipcode: '',
      county: '',
      district: '',
      detail: '',
    },
    name: '',
    phone: '',
    email: '',
  }
}
function submitOrder() {
  // 檢查必填欄位
  if (!userInfo.value.name || !userInfo.value.phone
    || !userInfo.value.email || !userInfo.value.address.county
    || !userInfo.value.address.district || !userInfo.value.address.detail) {
    notifyWarn('警告', '請填寫完所有必填欄位')
    return
  }

  if (submitButtonRef.value) {
    submitButtonRef.value.click()
  }
}
function handleBookingData(roomInfo: TApiRoomItem, userInfo: TUser) {
  // 設定郵遞區號
  if (districtList.value?.length) {
    const district = districtList.value.find(district => district.name === userInfo.address.district)
    if (district)
      userInfo.address.zipcode = district.zip
  }
  if (totalPrice.value) {
    roomInfo.totalPrice = totalPrice.value
  }
  // 組合地址
  const fullAddress = `${userInfo.address.county}${userInfo.address.district}${userInfo.address.detail}`
  const orderUserInfo = {
    name: userInfo.name,
    phone: userInfo.phone,
    email: userInfo.email,
    address: {
      zipcode: String(userInfo.address.zipcode),
      detail: fullAddress,
    },
  }
  setOrderResult({ ...roomInfo, userInfo: orderUserInfo })

  return orderUserInfo
}
async function createOrder(roomInfo: TApiRoomItem, userInfo: TUser) {
  try {
    isLoading.value = true
    const cookie = useCookie('Freyja-token')
    const orderUserInfo = handleBookingData(roomInfo, userInfo)

    const orderData = {
      roomId: bookingInfo.value?.roomId,
      checkInDate: bookingInfo.value?.checkInDate,
      checkOutDate: bookingInfo.value?.checkOutDate,
      peopleNum: bookingInfo.value?.peopleNum,
      userInfo: orderUserInfo,
    }
    const response = await $fetch<TApiGenericResponse<any>>('/api/v1/orders', {
      baseURL: 'https://nuxr3.zeabur.app',
      method: 'POST',
      body: orderData,
      headers: cookie.value ? { Authorization: cookie.value } : undefined,
    })
    if (response.status) {
      setTimeout(async () => {
        // console.log('response', response)
        isLoading.value = false
        await navigateTo(`/confirm/${orderId}`)
        resetUserForm()
      }, 1500)
    }
  }
  catch (error) {
    if (error instanceof FetchError) {
      console.error('建立訂單失敗:', error)
      isLoading.value = false
      throw error
    }
  }
}
</script>

<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <button
          class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
          type="button"
          @click="goBack"
        >
          <Icon
            class="fs-5 text-neutral-100"
            icon="mdi:keyboard-arrow-left"
          />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">
            確認訂房資訊
          </h1>
        </button>

        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-6">
            <section class="bookingInfo">
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      選擇房型
                    </h3>
                    <p class="mb-0 fw-medium">
                      {{ roomInfo?.name }}
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button>
                </div>
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      訂房日期
                    </h3>
                    <p class="mb-2 fw-medium">
                      入住：{{ formatDateWeekday(bookingInfo?.checkInDate || '') }}
                    </p>
                    <p class="mb-0 fw-medium">
                      退房：{{ formatDateWeekday(bookingInfo?.checkOutDate || '') }}
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button>
                </div>
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      房客人數
                    </h3>
                    <p class="mb-0 fw-medium">
                      {{ bookingInfo?.peopleNum }} 人
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button>
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

            <!-- 訂房人資訊 -->
            <section class="form-section">
              <div class="d-flex justify-content-between align-items-center mb-10">
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <button
                  class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button"
                >
                  套用會員資料
                </button>
              </div>

              <div class="d-flex flex-column gap-6">
                <VForm v-slot="{ errors, meta }" class="d-flex flex-column gap-6" @submit="createOrder(roomInfo, userInfo)">
                  <div class="mb-3">
                    <label for="name" class="form-label fs-8 fs-md-7 fw-bold">姓名</label>
                    <VField
                      id="name"
                      v-model="userInfo.name"
                      name="姓名"
                      rules="required|min:2"
                      type="text"
                      class="form-control rounded-3"
                      :class="{ 'is-invalid': errors['姓名'] }"
                      placeholder="請輸入姓名"
                    />
                    <VErrorMessage name="姓名" class="invalid-feedback" />
                  </div>
                  <div class="mb-3">
                    <label for="phone" class="form-label fs-8 fs-md-7 fw-bold">手機號碼</label>
                    <VField
                      id="phone"
                      v-model="userInfo.phone"
                      name="手機號碼"
                      rules="required|phone"
                      type="tel"
                      class="form-control rounded-3"
                      :class="{ 'is-invalid': errors['手機號碼'] }"
                      placeholder="請輸入手機號碼"
                    />
                    <VErrorMessage name="手機號碼" class="invalid-feedback" />
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label fs-8 fs-md-7 fw-bold">電子信箱</label>
                    <VField
                      id="email"
                      v-model="userInfo.email"
                      name="電子信箱"
                      rules="required|email"
                      type="email"
                      class="form-control rounded-3"
                      :class="{ 'is-invalid': errors['電子信箱'] }"
                      placeholder="請輸入電子信箱"
                    />
                    <VErrorMessage name="電子信箱" class="invalid-feedback" />
                  </div>
                  <div class="mb-3">
                    <label for="road" class="form-label fs-8 fs-md-7 fw-bold">地址</label>
                    <div class="d-flex gap-2 mb-4">
                      <VField
                        v-model="userInfo.address.county"
                        name="縣市"
                        rules="required"
                        as="select"
                        class="form-select"
                        :class="{ 'is-invalid': errors['縣市'] }"
                      >
                        <option selected disabled>
                          請選擇縣市
                        </option>
                        <option v-for="city in cityList" :key="city" :value="city">
                          {{ city }}
                        </option>
                      </VField>
                      <VField
                        v-model="userInfo.address.district"
                        name="行政區"
                        rules="required"
                        as="select"
                        class="form-select"
                        :class="{ 'is-invalid': errors['行政區'] }"
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
                      </VField>
                    </div>
                    <VField
                      id="road"
                      v-model="userInfo.address.detail"
                      name="詳細地址"
                      rules="required"
                      type="text"
                      class="form-control rounded-3"
                      :class="{ 'is-invalid': errors['詳細地址'] }"
                      placeholder="請輸入詳細地址"
                    />
                    <VErrorMessage name="詳細地址" class="invalid-feedback" />
                  </div>
                  <button
                    ref="submitButtonRef"
                    type="submit"
                    class="d-none"
                    :disabled="!meta.valid"
                  />
                </VForm>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

            <!-- 房間資訊 -->
            <section class="roomInfo">
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul
                    v-if="roomInfo?.areaInfo"
                    class="d-flex gap-4 list-unstyled"
                  >
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomInfo?.areaInfo }}
                      </p>
                    </li>
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomInfo?.bedInfo }}
                      </p>
                    </li>
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        2-{{ roomInfo?.maxPeople }} 人
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    房間格局
                  </h3>
                  <ul
                    v-if="roomInfo?.layoutInfo"
                    class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="layout in roomInfo?.layoutInfo"
                      :key="layout.title"
                      class="d-flex gap-2"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ layout.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    房內設備
                  </h3>
                  <ul
                    v-if="roomInfo?.facilityInfo"
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="facility in roomInfo?.facilityInfo"
                      :key="facility.title"
                      class="flex-item d-flex gap-2"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ facility.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    備品提供
                  </h3>
                  <ul
                    v-if="roomInfo?.amenityInfo"
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="amenity in roomInfo?.amenityInfo"
                      :key="amenity.title"
                      class="flex-item d-flex gap-2"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        衛生紙
                      </p>
                    </li>
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-6">
            <section class="order confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0">
              <img
                class="img-fluid rounded-3"
                :src="roomInfo?.imageUrl"
                alt="room-a"
              >

              <div class="Group">
                <h2 class="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="d-flex align-items-center text-neutral-100 fw-medium">
                    <span>NT$ {{ roomInfo?.price }}</span>
                    <Icon
                      class="ms-2 me-1 text-neutral-80"
                      icon="material-symbols:close"
                    />
                    <span class="text-neutral-80">{{ bookingInfo?.bookingDays }} 晚</span>
                  </div>
                  <span class="fw-medium">
                    NT$ {{ roomInfo?.price && bookingInfo?.bookingDays ? roomInfo.price * bookingInfo.bookingDays : 0 }}
                  </span>
                </div>
                <div class="d-flex justify-content-between align-items-center fw-medium">
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <span class="text-primary-100">
                    -NT$ {{ discountPrice }}
                  </span>
                </div>
                <hr class="my-6 opacity-100 text-neutral-40">
                <div class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold">
                  <p class="d-flex align-items-center mb-0">
                    總價
                  </p>
                  <span>
                    NT$ {{ totalPrice }}
                  </span>
                </div>
              </div>

              <button
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                type="button"
                @click="submitOrder"
              >
                確認訂房
              </button>
            </section>
          </div>
        </div>
      </div>
    </section>

    <RoomsBookingLoading v-if="isLoading" />
  </main>
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

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #BF9D7D;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}
</style>
