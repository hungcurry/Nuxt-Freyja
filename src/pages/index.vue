<script setup lang="ts">
import type { TApiCulinaryItem, TApiGenericResponse, TApiNewsItem, TApiRoomItem } from '@/types/apiTypes'
import { Icon } from '@iconify/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

definePageMeta({
  name: 'home',
})

const modules = ref([Autoplay, Navigation, Pagination])
const roomSwiper = useTemplateRef('roomSwiper')
const { public: { apiBaseUrl } } = useRuntimeConfig()

// SSR
const { data: apiData } = await useAsyncData('info', async () => {
  const apiEndpoints = {
    rooms: { url: '/rooms/' },
    news: { url: '/home/news' },
    culinary: { url: '/home/culinary' },
  }
  const fetchRequests = Object.entries(apiEndpoints).map(async ([key, { url }]) => {
    try {
      const response = await $fetch<TApiGenericResponse<any>>(url, {
        baseURL: apiBaseUrl,
        method: 'GET',
      })
      return response.result ?? null
    }
    catch (error) {
      console.error(`獲取 ${key} 資料時發生錯誤:`, error)
      return null
    }
  })

  const responses = await Promise.allSettled(fetchRequests)
  const data = responses.map((response) => {
    if (response.status === 'fulfilled') {
      return response?.value ?? null
    }
    return null
  }) as [
    TApiRoomItem[] | null,
    TApiNewsItem[] | null,
    TApiCulinaryItem[] | null,
  ]
  return data
})
const [roomsList, newsList, culinaryList] = apiData.value || []

function slidePrev() {
  roomSwiper.value?.$el.swiper.slidePrev()
}
function slideNext() {
  roomSwiper.value?.$el.swiper.slideNext()
}
</script>

<template>
  <main class="overflow-hidden">
    <section class="hero position-relative">
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :pagination="true"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
        }"
      >
        <SwiperSlide v-for="(image, index) in roomsList?.[1]?.imageUrlList" :key="index">
          <picture>
            <source :srcset="image" media="(min-width:576px)">
            <img class="hero-img" :src="image" alt="hero banner">
          </picture>
        </SwiperSlide>
      </Swiper>

      <div class="hero-wrapper d-flex flex-column justify-content-center align-items-center flex-md-row justify-content-md-between gap-md-10 w-100 px-md-20 position-absolute z-2">
        <div class="d-flex flex-column align-items-center text-center d-md-block text-md-start">
          <div class="mt-10 mb-5 mt-md-0 mb-md-10 text-primary-100 fw-bold">
            <h2>
              享樂酒店
            </h2>
            <h5 class="mb-0 fs-7 fs-md-5">
              Enjoyment Luxury Hotel
            </h5>
          </div>
          <div class="deco-line" />
        </div>
        <div class="hero__intro position-relative">
          <div class="hero__intro-content">
            <h1 class="mb-6 text-white fw-bold text-nowrap">
              高雄<br>豪華住宿之選
            </h1>
            <p class="text-neutral-40 fw-semibold">
              我們致力於為您提供無與倫比的奢華體驗與優質服務
            </p>
            <NuxtLink
              to="/rooms"
              class="btn btn-neutral-0 d-flex justify-content-end align-items-center gap-3 w-100 text-end text-neutral-100 fs-5 fw-semibold border-0"
            >
              立即訂房
              <div class="cta-deco" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="news bg-primary-10 py-20 py-md-30">
      <div class="container position-relative">
        <div class="row">
          <div class="col-12 col-md-2">
            <div class="mb-10 mb-md-0">
              <h2 class="mb-6 mb-md-10 fs-1 fw-bold text-primary-100">
                最新<br>消息
              </h2>
              <div class="deco-line" />
            </div>
          </div>
          <div class="col-12 col-md-10 d-flex flex-column gap-10">
            <div v-for="news in newsList" :key="news._id" class="card bg-transparent border-0">
              <div class="d-flex flex-column flex-md-row align-items-center gap-6">
                <picture>
                  <source :src="news.image" media="(min-width: 576px)">
                  <img :src="news.image" class="w-100 rounded-3" :alt="news.title">
                </picture>
                <div class="card-body p-0">
                  <h3 class="card-title mb-2 mb-md-6 fw-bold">
                    {{ news.title }}
                  </h3>
                  <p class="card-text text-neutral-80 fs-8 fs-md-7 fw-medium">
                    {{ news.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about position-relative z-n1 bg-neutral-120 py-20 py-md-30">
      <div class="container p-0">
        <div class="about-content p-6 p-md-20 mt-10 ms-10 me-5 mt-md-20 mx-md-auto text-neutral-0">
          <div class="d-flex align-items-center gap-10 mb-10 mb-md-20">
            <h2 class="text-nowrap mb-0 fs-1 fw-bold">
              關於<br>我們
            </h2>
            <div class="deco-line" />
          </div>
          <div class="d-flex flex-column gap-4 gap-md-10 fw-medium">
            <p class="mb-0 fs-8 fs-md-7">
              享樂酒店，位於美麗島高雄的心臟地帶，是這座城市的璀璨瑰寶與傲人地標。
              <br>
              我們的存在，不僅僅是為了提供奢華的住宿體驗，更是為了將高雄的美麗與活力，獻給每一位蒞臨的旅客。
            </p>
            <p class="mb-0 fs-8 fs-md-7">
              我們的酒店，擁有時尚典雅的裝潢，每一個細節都充滿著藝術與設計的精緻。
              <br>
              我們的員工，都以熱情的服務與專業的態度，讓每一位客人都能感受到賓至如歸的溫暖。
            </p>
            <p class="mb-0 fs-8 fs-md-7">
              在這裡，您可以遙望窗外，欣賞高雄的城市景色，感受這座城市的繁華與活力；您也可以舒適地坐在我們的餐廳，品嚐精緻的佳餚，體驗無與倫比的味覺盛宴。
            </p>
            <p class="mb-0 fs-8 fs-md-7">
              享樂酒店，不僅是您在高雄的住宿之選，更是您感受高雄魅力的最佳舞台。我們期待著您的蒞臨，讓我們共同編織一段難忘的高雄故事。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="room-intro position-relative px-3 py-20 px-md-0 py-md-30 bg-neutral-120">
      <div
        class="d-flex flex-column flex-md-row justify-content-center align-items-center justify-content-md-start align-items-md-end gap-6 gap-md-20"
      >
        <Swiper
          ref="roomSwiper"
          :modules="modules"
          :slides-per-view="1"
          :pagination="true"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false,
          }"
          :loop="true"
        >
          <SwiperSlide v-for="(image, index) in roomsList?.[2]?.imageUrlList" :key="index">
            <picture>
              <source :srcset="image" media="(min-width:576px)">
              <img class="hero-img" :src="image" alt="hero banner">
            </picture>
          </SwiperSlide>
        </Swiper>

        <div class="room-intro-content text-neutral-0">
          <h2 class="mb-2 mb-md-4 fw-bold">
            {{ roomsList?.[0]?.name }}
          </h2>
          <p class="mb-6 mb-md-10 fs-8 fs-md-7">
            {{ roomsList?.[0]?.description }}
          </p>
          <div class="mb-6 mb-md-10 fs-3 fw-bold">
            NT$ {{ roomsList?.[0]?.price }}
          </div>
          <NuxtLink
            to="/rooms"
            class="btn btn-neutral-0 d-flex justify-content-end align-items-center gap-3 w-100 p-5 p-md-10 mb-6 mb-md-10 text-end text-neutral-100 fs-7 fs-md-5 fw-bold border-0"
          >
            查看更多
            <div class="cta-deco" />
          </NuxtLink>
          <div class="d-flex justify-content-end">
            <button
              class="bg-transparent text-primary-100 icon-link icon-link-hover border-0"
              type="button"
              @click="slidePrev"
            >
              <Icon
                icon="mdi:arrow-left"
                class="bi m-4"
                style="font-size: 1.5rem; --bs-icon-link-transform: translateX(-0.25em);"
              />
            </button>
            <button
              class="bg-transparent text-primary-100 icon-link icon-link-hover border-0"
              type="button"
              @click="slideNext"
            >
              <Icon icon="mdi:arrow-right" class="bi m-4" style="font-size: 1.5rem;" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="delicacy position-relative py-20 py-md-30 bg-primary-10">
      <div class="container">
        <div class="d-flex align-items-center gap-10 mb-10 mb-md-20">
          <h2 class="mb-0 fs-1 fw-bold text-primary-100">
            佳餚<br>美饌
          </h2>
          <div class="deco-line" />
        </div>
        <div class="row flex-nowrap overflow-x-auto">
          <div v-for="food in culinaryList" :key="food._id" class="col-10 col-md-6 col-xl-4">
            <div class="card position-relative border-0 rounded-3">
              <picture>
                <source :src="food.image" media="(min-width: 576px)">
                <img class="w-100 rounded-3" :src="food.image" alt="海霸">
              </picture>
              <div class="card-body position-absolute bottom-0 p-4 p-md-6 rounded-bottom-3  text-neutral-0">
                <div class="d-flex justify-content-between align-items-center mb-4 mb-md-6">
                  <h5 class="card-title mb-0 fw-bold">
                    {{ food.title }}
                  </h5>
                  <div class="d-flex justify-content-between gap-4 text-neutral-40 fs-8 fs-md-7">
                    <span class="fw-bold">{{ food.diningTime.split(' ')[0] }}</span>
                    <span class="fw-bold">{{ food.diningTime.split(' ')[1] }}</span>
                  </div>
                </div>
                <p class="card-text fs-8 fs-md-7">
                  {{ food.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="transportation  bg-neutral-120">
      <div class="container pt-20 pb-10 pt-md-30 pb-md-20">
        <div class="d-flex align-items-center gap-10 mb-10 mb-md-20">
          <h2 class="mb-0 fs-1 fw-bold text-primary-100">
            交通<br>方式
          </h2>
          <div class="deco-line" />
        </div>
        <div class="row gap-6 gap-md-0">
          <div class="col-12 mb-md-10">
            <p class="text-neutral-40 fw-bold">
              台灣高雄市新興區六角路123號
            </p>
            <!-- <picture>
              <source srcset="@/assets/images/home-map.png" media="(min-width: 576px)">
              <img class="w-100" src="@/assets/images/home-map-sm.png" alt="描述地圖中酒店所在的位置">
            </picture> -->

            <!-- 地圖 -->
            <div class="card position-relative overflow-hidden mb-6">
              <div class="imgBox">
                <div class="imgBox＿fit h-360px">
                  <iframe
                    class="w-100 h-100"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1371.539561874256!2d120.30033272582722!3d22.627929643973878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e043fb2fb3e29%3A0x6c32ad4bb5603de9!2z6LCi5Lqk5byA5YyX!5e0!3m2!1szh-TW!2stw!4v1642494351834!5m2!1szh-TW!2stw"
                    allowfullscreen
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4 text-neutral-0">
            <Icon class="mb-2 mb-md-4 display-1 text-primary-100" icon="ic:baseline-directions-car" />
            <h5 class="fs-7 fs-md-5 fw-bold">
              自行開車
            </h5>
            <p class="mb-0 fs-8 fs-md-7">
              如果您選擇自行開車，可以透過國道一號下高雄交流道，往市區方向行駛，並依路標指示即可抵達「享樂酒店」。飯店內設有停車場，讓您停車方便。
            </p>
          </div>
          <div class="col-12 col-md-4 text-neutral-0">
            <Icon class="mb-2 mb-md-4 display-1 text-primary-100" icon="ic:baseline-train" />
            <h5 class="fs-7 fs-md-5 fw-bold">
              高鐵/火車
            </h5>
            <p class="mb-0 fs-8 fs-md-7">
              如果您是搭乘高鐵或火車，可於左營站下車，外頭有計程車站，搭乘計程車約20分鐘即可抵達。或者您也可以轉乘捷運紅線至中央公園站下車，步行約10分鐘便可抵達。
            </p>
          </div>
          <div class="col-12 col-md-4 text-neutral-0">
            <Icon class="mb-2 mb-md-4 display-1 text-primary-100" icon="mdi:car-side" />
            <h5 class="fs-7 fs-md-5 fw-bold">
              禮賓車服務
            </h5>
            <p class="mb-0 fs-8 fs-md-7">
              承億酒店提供禮賓專車接送服務，但因目的地遠近會有不同的收費，請撥打電話將由專人為您服務洽詢專線：(07)123-4567
            </p>
          </div>
        </div>
      </div>
      <picture>
        <source srcset="@/assets/images/deco-line-group-horizontal-full.svg" media="(min-width:576px)">
        <img class="w-100" src="@/assets/images/deco-line-group-horizontal-sm.svg" alt="deco-line-group">
      </picture>
    </section>
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

section .btn {
  --primary: #BF9D7D;
  --neutral: #FFFFFF;
  height: clamp(4rem, 12vh, 7.25rem);
  padding: 5%;

  &:hover {
    box-shadow: inset 48vw 0 0 0 var(--primary);
    color: var(--neutral) !important;
    transition-duration: 0.25s;

    .cta-deco {
      background-color: var(--neutral) !important;
      width: 8vw;
    }
  }

  @include media-breakpoint-down(md) {
    height: 4rem;
  }
}

.cta-deco {
  width: 10vw;
  height: 1px;
  background-color: #000;
  transition: background-color 0.25s ease-in-out, width 0.25s ease-in-out;

  @include media-breakpoint-down(md) {
    width: 5rem;
  }
}

.hero img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  filter: brightness(40%);
}

.hero-wrapper {
  inset: 0;
}

.hero__intro {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: clamp(291px, 48vw, 924px);
  max-height: min(62vh, 672px);
  padding: 5.5%;
  background-image: linear-gradient(to bottom, #FFFFFF00, #FFFFFF4D);
  border-width: 1px 1px 0px 0px;
  border-style: solid;
  border-color: #F5F7F9;
  border-radius: 80px;
  backdrop-filter: blur(6px);

  @include media-breakpoint-down(md) {
    transform: translateX(10%);
    height: 420px;
  }
}

.hero__intro-content {
  max-width: 39vw;
  transform: translateX(-18%);

  @include media-breakpoint-down(md) {
    max-width: none;
    transform: translateX(-11%);
  }
}

.hero__intro-content h1 {
  font-size: clamp(3rem, 5.2vw, 6.25rem);
}

.hero__intro-content p {
  font-size: clamp(1rem, 1.7vw, 2rem);
  margin-bottom: min(5vh, 3.75rem);
  white-space: nowrap;

  @include media-breakpoint-down(md) {
    white-space: normal;
  }
}

.deco-line {
  width: 33vw;
  height: 2px;
  background-image: linear-gradient(to right, #BE9C7C, #FFFFFF);
}

.hero .deco-line {
  @include media-breakpoint-down(md) {
    width: 2px;
    height: 83px;
    z-index: 1;
    background-image: linear-gradient(to bottom, #BE9C7C, #FFF);
    margin-bottom: 2.5rem;
  }
}

.news .deco-line {
  width: 140px;
}

.news picture {
  --parent-witdh: 1076;
  --width: 474;
  --percent-width: calc(var(--width) / var(--parent-witdh) * 100%);
  width: var(--percent-width);
  flex-shrink: 0;

  @include media-breakpoint-down(md) {
    width: 100%;
  }
}

.news .container::before {
  background-image: url('@/assets/images/deco-dot-group.svg');
  content: '';
  display: block;
  position: absolute;
  top: -20px;
  right: -120px;
  width: 200px;
  height: 200px;

  @include media-breakpoint-down(md) {
    background-image: url('@/assets//images/deco-dot-group-sm.svg');
    width: 100px;
    height: 100px;
    top: -40px;
    right: 24px;
  }
}

.news .container::after {
  background-image: url('@/assets/images/deco-dot-group.svg');
  content: '';
  display: block;
  position: absolute;
  bottom: -200px;
  left: -100px;
  width: 200px;
  height: 200px;

  @include media-breakpoint-down(md) {
    background-image: url('@/assets/images/deco-dot-group-sm.svg');
    width: 100px;
    height: 100px;
    bottom: -140px;
    left: 24px;
  }
}

.about {
  background-image: url('@/assets/images/home-about.png');
  height: 992px;
  background-position-y: 120px;
  background-repeat: no-repeat;

  @include media-breakpoint-down(md) {
    background-position-y: 80px;
    height: 794px;
  }
}

.about-content {
  max-width: 1044px;
  background-image: linear-gradient(180deg, rgba(20, 15, 10, 0.8) 0%, rgba(190, 156, 124, 0.8) 100%);
  backdrop-filter: blur(10px);
  border-width: 0px 0px 1px 1px;
  border-style: solid;
  border-color: #FFFFFF;
  border-radius: 80px 80px 0px 80px;
  transform: translateX(7vw);

  @include media-breakpoint-down(md) {
    height: 594px;
    border-radius: 40px 40px 0px 40px;
    transform: none;
  }
}

.about-content .deco-line {
  width: 165px;
  background: #fff;

  @include media-breakpoint-down(md) {
    width: 161px;
  }
}

.room-intro::before {
  position: absolute;
  top: -24px;
  right: -80px;
  z-index: 2;
  content: '';
  width: 375px;
  height: 84px;
  background-image: url('@/assets/images/deco-line-group-horizontal-sm.svg');
  background-repeat: no-repeat;

  @include media-breakpoint-up(md) {
    background-image: url('@/assets/images/deco-line-group-horizontal.svg');
    width: 1060px;
    height: 187px;
    top: -50px;
    left: 430px;
    right: auto;
  }

  @include media-breakpoint-up(lg) {
    top: 0px;
    left: 430px;
  }

  @include media-breakpoint-up(xl) {
    top: 130px;
    left: 630px;
  }

  @include media-breakpoint-up(xxxl) {
    top: 180px;
    left: 860px;
  }
}

.room-intro::after {
  position: absolute;
  z-index: -1;
  bottom: 265px;
  right: 0;
  content: '';
  width: 375px;
  height: 132px;
  background-image: url('@/assets/images/deco-wave-bg-sm.svg');
  background-repeat: no-repeat;

  @include media-breakpoint-up(md) {
    background-image: url('@/assets/images/deco-wave-bg.svg');
    width: 1920px;
    height: 86%;
    bottom: 0;
    left: -280px;
    right: auto;
  }

  @include media-breakpoint-up(lg) {
    height: 80%;
  }

  @include media-breakpoint-up(xl) {
    height: 62.5%;
    left: -100px;
  }

  @include media-breakpoint-up(xxxl) {
    height: 677px;
    bottom: 0;
    left: 0;
  }
}

.room-intro .swiper {
  --origin-width: 900;
  --container-width: 1920;
  --percent-width: calc(var(--origin-width) / var(--container-width) * 100vw);
  max-width: var(--percent-width);
  margin: 0;

  @include media-breakpoint-down(md) {
    max-width: 100%;
  }
}

.room-intro-content {
  max-width: 628px;

  @include media-breakpoint-up(xxxl) {
    flex-grow: 1;
  }
}

.delicacy::before {
  @include media-breakpoint-up(lg) {
    position: absolute;
    top: -40px;
    right: 80px;
    content: '';
    width: 200px;
    height: 200px;
    background-image: url('@/assets/images/deco-dot-group.svg');
  }
}

.delicacy::after {
  @include media-breakpoint-up(xxxl) {
    position: absolute;
    top: 55px;
    left: 40px;
    content: '';
    width: 187px;
    height: 1068px;
    background-image: url('@/assets/images/deco-line-group-vertical.svg');
  }
}

.delicacy .deco-line {
  width: 200px;

  @include media-breakpoint-up(md) {
    width: 167px;
  }
}

.delicacy .card-body {
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #140F0A 77.6%);
  backdrop-filter: blur(10px);
}

.transportation .deco-line {
  width: 161px;

  @include media-breakpoint-down(md) {
    width: 194px;
  }
}

.swiper :deep(.swiper-button-prev),
.swiper :deep(.swiper-button-next) {
  width: 56px;
  height: 56px;
  background-color: #FFFFFF;
  color: #4B4B4B;
  border-radius: 100px;

  @include media-breakpoint-down(md) {
    display: none;
  }
}

.swiper :deep(.swiper-button-prev::after),
.swiper :deep(.swiper-button-next::after) {
  font-size: 40px;
}

.swiper :deep(.swiper-button-prev::after) {
  display: inline-block;
  width: 1em;
  height: 1em;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z'/%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.swiper :deep(.swiper-button-next::after) {
  display: inline-block;
  width: 1em;
  height: 1em;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z'/%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.swiper :deep(.swiper-pagination) {
  bottom: 24px;
}

.swiper :deep(.swiper-pagination-bullet) {
  width: 32px;
  height: 4px;
  background-color: #F1EAE4;
  border-radius: 100px;
  opacity: 1;
}

.swiper :deep(.swiper-pagination-bullet-active) {
  width: 60px;
  background-color: #BF9D7D;
}
</style>
