<script setup lang="ts">
import type { TApiGenericResponse } from '@/types/apiTypes'
import { Icon } from '@iconify/vue'

definePageMeta({
  name: 'user-order',
  middleware: ['account-auth'],
})

const token = useCookie<string>('Freyja-token')
const modalRef = useTemplateRef('modalRef')
const visibleCount = ref(3)
const { notifySuccess, notifyError } = useNotifications()
const { formatDateWeekday } = useDateRange()
const { $ModalInstance } = useNuxtApp()
const { public: { apiBaseUrl } } = useRuntimeConfig()
let modal: { show: () => void, hide: () => void }

// SSR
const { data: bookingList, refresh } = await useFetch('/orders', {
  baseURL: apiBaseUrl,
  method: 'GET',
  headers: {
    Authorization: token.value,
  },
  transform: (response: TApiGenericResponse<any>) => {
    const { result } = response
    // console.log('orders', result)
    const orderList = result.filter((order: any) => order.status === 0)
    return orderList
  },
  onResponseError({ response }) {
    const { message } = response._data
    console.error('Error:', message)
    navigateTo('/')
  },
})
const orderList = computed(() => {
  return JSON.parse(JSON.stringify(bookingList.value))
})
const sliceOrderList = computed(() => {
  return orderList.value.slice(0, visibleCount.value)
})
const latestOrder = computed(() => {
  return orderList.value[orderList.value.length - 1] || {}
})
const daysCount = computed(() => {
  const { checkInDate, checkOutDate } = latestOrder.value
  return calculateDaysCount(checkInDate, checkOutDate)
})
const totalPrice = computed(() => {
  return calculateTotalPrice(daysCount.value, latestOrder.value?.roomId?.price)
})
const roomId = computed(() => {
  return latestOrder.value.roomId._id
})

function openModal() {
  modal?.show()
}
function closeModal() {
  modal?.hide()
}
function calculateDaysCount(checkInDate: string, checkOutDate: string) {
  if (!checkInDate || !checkOutDate)
    return 0

  const differenceTime = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()
  return Math.round(differenceTime / (1000 * 60 * 60 * 24))
}
function calculateTotalPrice(days: number, price: number) {
  let total = 0
  if (days) {
    total = days * price
  }
  return total
}
function handleShowMoreList() {
  visibleCount.value += 3
}
function handleGotoRoom() {
  if (!roomId.value)
    return
  navigateTo(`/rooms/${roomId.value}`)
}
async function handleDelete(id: string) {
  if (!id)
    return

  try {
    const response = await $fetch<TApiGenericResponse<any>>(`/orders/${id}`, {
      baseURL: apiBaseUrl,
      method: 'DELETE',
      headers: {
        Authorization: token.value,
      },
    })
    notifySuccess('訂單已成功刪除')
    refresh()
    closeModal()
  }
  catch (error) {
    console.error('刪除訂單失敗:', error)
    notifyError('刪除訂單失敗，請稍後再試')
  }
}
onMounted(() => {
  modal = $ModalInstance(modalRef.value, { keyboard: false })
})
</script>

<template>
  <div class="row gap-6 gap-md-0">
    <p v-if="orderList.length === 0" class="text-neutral-80 fs-8 fs-md-7 fw-bold text-center">
      您目前沒有任何訂單
    </p>

    <div class="col-12 col-md-7">
      <div
        v-if="orderList.length > 0"
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
        style="max-width: 730px;"
      >
        <div>
          <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">
            預訂參考編號： {{ latestOrder?._id }}
          </p>
          <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
            即將來的行程
          </h2>
        </div>

        <img
          class="img-fluid rounded-3"
          :src="latestOrder?.roomId?.imageUrl"
          alt="room-a"
        >

        <section class="d-flex flex-column gap-6">
          <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
            <p class="mb-0">
              尊爵雙人房，{{ daysCount }}晚
            </p>
            <span
              class="d-inline-block mx-4 bg-neutral-80"
              style="width: 1px;height: 18px;"
            />
            <p class="mb-0">
              住宿人數：{{ latestOrder?.peopleNum }} 位
            </p>
          </h3>

          <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
            <p class="title-deco mb-2">
              入住：{{ formatDateWeekday(latestOrder?.checkInDate || '') }}，15:00 可入住
            </p>
            <p
              class="title-deco mb-0"
            >
              退房：{{ formatDateWeekday(latestOrder?.checkOutDate || '') }}，12:00 前退房
            </p>
          </div>

          <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
            NT$ {{ totalPrice }}
          </p>
        </section>

        <hr class="my-0 opacity-100 text-neutral-40">

        <section>
          <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            房內設備
          </h3>
          <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
            <li
              v-for="room in latestOrder?.roomId?.facilityInfo"
              :key="room.title"
              class="flex-item d-flex gap-2"
            >
              <Icon
                class="fs-5 text-primary-100"
                icon="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">
                {{ room.title }}
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            備品提供
          </h3>
          <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
            <li
              v-for="item in latestOrder?.roomId?.amenityInfo"
              :key="item.title"
              class="flex-item d-flex gap-2"
            >
              <Icon
                class="fs-5 text-primary-100"
                icon="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">
                {{ item.title }}
              </p>
            </li>
          </ul>
        </section>

        <div class="d-flex gap-4">
          <button
            data-bs-toggle="modal"
            data-bs-target="#cancelModal"
            class="btn btn-outline-primary-100 w-50 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            type="button"
          >
            取消預訂
          </button>
          <NuxtLink
            class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold"
            type="button"
            @click="handleGotoRoom"
          >
            查看詳情
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-5">
      <div
        v-if="orderList.length > 0"
        class="history-order rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
      >
        <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
          歷史訂單 : {{ orderList?.length }} 筆數
        </h2>

        <template
          v-for="(booking) in sliceOrderList"
          :key="booking._id"
        >
          <div class="d-flex flex-column flex-lg-row gap-6">
            <img
              class="img-fluid object-fit-cover rounded-3"
              style="max-width: 120px; height: 80px"
              :src="booking.roomId.imageUrl"
              :alt="booking.name"
            >
            <section class="d-flex flex-column gap-4">
              <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                預訂參考編號： {{ booking._id }}
              </p>
              <h3
                class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
              >
                {{ booking.roomId.name }}
              </h3>
              <div class="text-neutral-80 fw-medium">
                <p class="mb-2">
                  住宿天數：
                  {{ calculateDaysCount(booking.checkInDate, booking.checkOutDate) }}
                  晚
                </p>
                <p class="mb-0">
                  住宿人數： {{ booking.peopleNum }} 位
                </p>
              </div>
              <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
                <p class="title-deco mb-2">
                  入住：
                </p>
                <p>
                  {{ formatDateWeekday(booking.checkInDate || '') }}，15:00 可入住
                </p>
                <p class="title-deco mb-0">
                  退房：
                </p>
                <p>
                  {{ formatDateWeekday(booking.checkOutDate || '') }}，12:00 前退房
                </p>
              </div>
              <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
                NT$ {{ calculateTotalPrice(calculateDaysCount(booking.checkInDate, booking.checkOutDate), booking.roomId.price) }}
              </p>
            </section>
          </div>
          <hr
            v-if="visibleCount < bookingList.length"
            class="my-0 opacity-100 text-neutral-40"
          >
        </template>

        <button
          v-if="visibleCount < bookingList.length"
          class="btn btn-outline-primary-100 py-4 fw-bold"
          style="--bs-btn-hover-color: #fff"
          type="button"
          @click="handleShowMoreList"
        >
          查看更多
        </button>
      </div>
    </div>
  </div>

  <div
    id="cancelModal"
    ref="modalRef"
    class="modal fade"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold">
          確定要取消此房型的預訂嗎？
        </div>
        <div class="modal-footer d-flex gap-4">
          <button
            type="button"
            class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            data-bs-dismiss="modal"
          >
            關閉視窗
          </button>
          <button
            type="button"
            class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold"
            @click="handleDelete(latestOrder?._id)"
          >
            確定取消
          </button>
        </div>
      </div>
    </div>
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

.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #BF9D7D;
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}

.modal {
  backdrop-filter: blur(10px);

  @include media-breakpoint-down(md) {
    backdrop-filter: none;
  }
}

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>
