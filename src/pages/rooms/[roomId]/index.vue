<script setup lang="ts">
import type { TApiGenericResponse, TApiRoomItem } from '@/types/apiTypes'
import { Icon } from '@iconify/vue'

definePageMeta({
  name: 'room-detail',
})

const bookingStore = useBookingStore()
const { todayDate, nextYearDate, formatDateOnMobile } = useDateRange()
const { setBookingInfo, setRoomInfo } = bookingStore
const { public: { apiBaseUrl } } = useRuntimeConfig()
const datePickerRef = useTemplateRef('datePickerRef')
const isDisabled = ref(true)
const route = useRoute()
const roomId = route.params.roomId
const MAX_BOOKING_PEOPLE = ref(10)
const bookingPeople = ref(1)
const daysCount = ref(0)
const bookingDate = ref({
  date: {
    start: todayDate,
    end: null,
  },
  // 最小可選日期(今天)
  minDate: todayDate,
  // 最大可選日期(一年後)
  maxDate: nextYearDate,
  maxPeople: MAX_BOOKING_PEOPLE.value,
})
// SSR
const { data: room } = await useFetch(`/rooms/${roomId}`, {
  baseURL: apiBaseUrl,
  transform: (response: TApiGenericResponse<TApiRoomItem>) => {
    const { result } = response
    // console.log('room', result)
    return result
  },
  onResponseError({ response }) {
    const { message } = response._data
    console.error('Error:', message)
    navigateTo('/')
  },
})
handleinit()

function openModal() {
  datePickerRef.value?.openModal()
}
function emitDateChange(bookingInfo: any) {
  const { start, end } = bookingInfo.date
  bookingDate.value.date.start = start
  bookingDate.value.date.end = end

  bookingPeople.value = bookingInfo?.people || 1
  daysCount.value = bookingInfo.daysCount

  isDisabled.value = false
}
function takeReservation() {
  if (isDisabled.value)
    return
  setBookingInfo({
    roomId,
    checkInDate: bookingDate.value.date.start,
    checkOutDate: bookingDate.value.date.end || '',
    bookingDays: daysCount.value,
    peopleNum: bookingPeople.value,
  })
  // console.log('bookingInfo', bookingStore.bookingInfo)

  handleReservation()
  isDisabled.value = true
}
function handleReservation() {
  navigateTo(`/rooms/${roomId}/booking`)
}
function handleinit() {
  if (room.value) {
    MAX_BOOKING_PEOPLE.value = room.value.maxPeople
    bookingDate.value.maxPeople = room.value.maxPeople
    setRoomInfo(room.value)
  }
}
</script>

<template>
  <main class="mt-18 mt-md-30 bg-neutral-100">
    <section v-if="room" class="imageGroup p-md-20 bg-primary-10">
      <div class="mobile-image position-relative d-md-none">
        <img
          class="img-fluid"
          :src="room?.imageUrl"
          alt="room-a-1"
        >
        <button
          class="position-absolute btn btn-primary-10 px-8 py-4 text-primary-100 border-primary-100 fw-bold rounded-3"
          style="bottom: 23px; right: 12px;"
          type="button"
        >
          看更多
        </button>
      </div>

      <div class="table-image position-relative d-none d-md-block">
        <div class="d-flex gap-2 rounded-3xl overflow-hidden">
          <div style="width: 52.5vw;">
            <img
              class="w-100"
              :src="room?.imageUrl"
              alt="room-a-1"
            >
          </div>

          <div
            v-if="room?.imageUrlList"
            class="imageUrlList d-flex flex-wrap gap-md-2"
            style="width: 42.5vw;"
          >
            <div class="d-flex gap-md-2">
              <img
                class="w-50"
                :src="room?.imageUrlList[0]"
                alt="room-a-2"
              >
              <img
                class="w-50"
                :src="room?.imageUrlList[1]"
                alt="room-a-3"
              >
            </div>
            <div class="d-flex gap-md-2">
              <img
                class="w-50"
                :src="room?.imageUrlList[2]"
                alt="room-a-4"
              >
              <img
                class="w-50"
                :src="room?.imageUrlList[3]"
                alt="room-a-5"
              >
            </div>
          </div>
        </div>
        <button
          class="position-absolute btn btn-primary-10 px-8 py-4 me-3 text-primary-100 border-primary-100 fw-bold rounded-3"
          style="bottom: 40px; right: 40px;"
          type="button"
        >
          看更多
        </button>
      </div>
    </section>

    <section v-if="room" class="schedule py-10 py-md-30 bg-primary-10">
      <div class="container">
        <div class="row">
          <div class="roomInfo col-12 col-md-7 d-flex flex-column gap-6 gap-md-20">
            <div>
              <h1 class="mb-4 text-neutral-100 fw-bold">
                {{ room?.name }}
              </h1>
              <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                {{ room?.description }}
              </p>
            </div>

            <section>
              <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                房型基本資訊
              </h3>
              <ul class="d-flex gap-4 list-unstyled">
                <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                  <Icon
                    class="mb-2 fs-5 text-primary-100"
                    icon="fluent:slide-size-24-filled"
                  />
                  <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                    {{ room?.areaInfo }}
                  </p>
                </li>
                <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                  <Icon
                    class="mb-2 fs-5 text-primary-100"
                    icon="material-symbols:king-bed"
                  />
                  <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                    {{ room?.bedInfo }}
                  </p>
                </li>
                <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                  <Icon
                    class="mb-2 fs-5 text-primary-100"
                    icon="ic:baseline-person"
                  />
                  <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                    2-{{ room?.maxPeople }} 人
                  </p>
                </li>
              </ul>
            </section>

            <section>
              <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                房間格局
              </h3>
              <ul
                v-if="room?.layoutInfo"
                class="d-flex flex-wrap gap-6 gap-md-10 p-6 bg-neutral-0 fs-8 fs-md-7 rounded-3 list-unstyled"
              >
                <li
                  v-for="layout in room?.layoutInfo"
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
                v-if="room?.facilityInfo"
                class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 bg-neutral-0 fs-8 fs-md-7 rounded-3 list-unstyled"
              >
                <li
                  v-for="facility in room?.facilityInfo"
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
                v-if="room?.amenityInfo"
                class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 bg-neutral-0 fs-8 fs-md-7 rounded-3 list-unstyled"
              >
                <li
                  v-for="amenity in room.amenityInfo"
                  :key="amenity.title"
                  class="flex-item d-flex gap-2"
                >
                  <Icon
                    class="fs-5 text-primary-100"
                    icon="material-symbols:check"
                  />
                  <p class="mb-0 text-neutral-80 fw-bold">
                    {{ amenity.title }}
                  </p>
                </li>
              </ul>
            </section>

            <section>
              <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                訂房須知
              </h3>
              <ol class="text-neutral-80 fs-8 fs-md-7 fw-medium">
                <li>入住時間為下午3點，退房時間為上午12點。</li>
                <li>如需延遲退房，請提前與櫃檯人員聯繫，視當日房況可能會產生額外費用。</li>
                <li>請勿在房間內抽煙，若有抽煙需求，可以使用設在酒店各樓層的專用吸煙區。</li>
                <li>若發現房間內的設施有損壞或遺失，將會按照價值收取賠償金。</li>
                <li>請愛惜我們的房間與公共空間，並保持整潔。</li>
                <li>如需額外的毛巾、盥洗用品或其他物品，請聯繫櫃檯。</li>
                <li>我們提供免費的Wi-Fi，密碼可以在櫃檯或是房間內的資訊卡上找到。</li>
                <li>請勿帶走酒店房內的物品，如有需要購買，請與我們的櫃檯人員聯繫。</li>
                <li>我們提供24小時櫃檯服務，若有任何需求或疑問，歡迎隨時詢問。</li>
                <li>為了確保所有客人的安全，請勿在走廊或公共區域大聲喧嘩，並遵守酒店的其他規定。</li>
              </ol>
            </section>
          </div>

          <div class="roomcheck col-md-5 d-none d-md-block">
            <div
              class="rounded-3xl position-sticky d-flex flex-column gap-10 p-10 ms-auto bg-neutral-0"
              style="top: 160px; max-width: 478px;"
            >
              <h5 class="pb-4 mb-0 text-neutral-100 fw-bold border-bottom border-neutral-40">
                預訂房型
              </h5>

              <div class="text-neutral-80">
                <h2 class="fw-bold">
                  {{ room?.name || '雙人房' }}
                </h2>
                <p class="mb-0 fw-medium">
                  {{ room?.description || '享受高級的住宿體驗' }}
                </p>
              </div>

              <div class="roomCheckForm">
                <div class="d-flex flex-wrap gap-2 mb-4">
                  <div class="form-floating flex-grow-1 flex-shrink-1">
                    <input
                      id="checkinInput"
                      readonly
                      type="date"
                      :value="bookingDate.date.start"
                      class="form-control p-4 pt-9 text-neutral-100 fw-medium border-neutral-100 rounded-3"
                      style="min-height: 74px;"
                      placeholder="yyyy-mm-dd"
                      @click="openModal"
                    >
                    <label
                      class="text-neutral-80 fw-medium"
                      style="top: 8px;left: 8px;"
                      for="checkinInput"
                    >入住
                    </label>
                  </div>

                  <div class="form-floating flex-grow-1 flex-shrink-1">
                    <input
                      id="checkoutInput"
                      readonly
                      type="date"
                      :value="bookingDate.date.end"
                      class="form-control p-4 pt-9 text-neutral-100 fw-medium border-neutral-100 rounded-3"
                      style="min-height: 74px;"
                      placeholder="yyyy-mm-dd"
                      @click="openModal"
                    >
                    <label
                      class="text-neutral-80 fw-medium"
                      style="top: 8px;left: 8px;"
                      for="checkoutInput"
                    >退房
                    </label>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <p class="mb-0">
                    人數
                  </p>
                  <div class="d-flex align-items-center gap-4">
                    <button
                      :class="{ 'disabled bg-neutral-40': bookingPeople === 1 }"
                      class="btn btn-neutral-0 p-4 border border-neutral-40 rounded-circle"
                      type="button"
                      @click="bookingPeople--"
                    >
                      <Icon
                        class="fs-5 text-neutral-100"
                        icon="ic:baseline-minus"
                      />
                    </button>

                    <h6
                      id="people"
                      class="d-flex justify-content-center align-items-center fw-bold text-neutral-100"
                      style="width: 24px;"
                      name="people"
                    >
                      {{ bookingPeople }}
                    </h6>

                    <button
                      :class="{ 'disabled bg-neutral-40': bookingPeople === MAX_BOOKING_PEOPLE }"
                      class="btn btn-neutral-0 p-4 border border-neutral-40 rounded-circle"
                      type="button"
                      @click="bookingPeople++"
                    >
                      <Icon
                        class="fs-5 text-neutral-100"
                        icon="ic:baseline-plus"
                      />
                    </button>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-10">
                  <h5 class="mb-0 text-primary-100 fw-bold">
                    NT$ {{ room?.price || 0 }}
                  </h5>
                  <p class="mb-0 text-neutral-80 fw-medium">
                    {{ daysCount }}晚
                  </p>
                </div>
              </div>

              <NuxtLink
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                :disabled="isDisabled"
                :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
                @click="takeReservation"
              >
                立即預訂
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="roomcheck-mobile d-flex d-md-none justify-content-between align-items-center position-fixed bottom-0 w-100 p-3 bg-neutral-0">
        <template v-if="bookingDate.date.end === null">
          <small class="text-neutral-80 fw-medium">ＮＴ$ {{ room?.price }} / 晚</small>
          <button
            class="btn btn-primary-100 px-12 py-4 text-neutral-0 fw-bold rounded-3"
            type="button"
            @click="openModal"
          >
            查看可訂日期
          </button>
        </template>

        <template v-else>
          <div class="d-flex flex-column gap-1">
            <small class="text-neutral-80 fw-medium">ＮＴ$ {{ room?.price }} / {{ daysCount }} 晚 / {{ bookingPeople }} 人</small>
            <span class="text-neutral fs-9 fw-medium text-decoration-underline">{{ formatDateOnMobile(bookingDate.date?.start) }} - {{ formatDateOnMobile(bookingDate.date?.end) }}</span>
          </div>
          <NuxtLink
            class="btn btn-primary-100 px-12 py-4 text-neutral-0 fw-bold rounded-3"
            @click="takeReservation"
          >
            立即預訂
          </NuxtLink>
        </template>
      </div>
    </section>

    <ClientOnly>
      <RoomsDatePickerModal
        ref="datePickerRef"
        v-bind="bookingDate"
        @handle-date-change="emitDateChange"
      />
    </ClientOnly>
  </main>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

// 斷點設定
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px
);

// 圓角設定
.rounded-3xl {
  border-radius: 1.25rem;
}

// 房型資訊卡片樣式
.card-info {
  width: 97px;
  height: 97px;
}

// 標題裝飾線樣式
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

// 設備列表項目樣式
.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

// 日期選擇器游標樣式
input[type="date"] {
  cursor: pointer;
}
</style>
