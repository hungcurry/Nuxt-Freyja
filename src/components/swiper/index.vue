<script setup lang="ts">
import type { SwiperOptions } from 'swiper/types'
import type { PropType } from 'vue'
import { Swiper } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const props = defineProps({
  modules: {
    type: Array as PropType<SwiperOptions['modules']>,
    required: true,
  },
  autoplay: {
    type: Object as PropType<SwiperOptions['autoplay']>,
    default: () => ({
      delay: 3000,
    }),
  },
  loop: {
    type: Boolean,
    default: true,
  },
  slidesPerView: {
    type: [Number, String] as PropType<SwiperOptions['slidesPerView']>,
    default: 1,
  },
  spaceBetween: {
    type: Number as PropType<SwiperOptions['spaceBetween']>,
    default: 10,
  },
  breakpoints: {
    type: Object as PropType<SwiperOptions['breakpoints']>,
    default: () => ({}),
  },
  pagination: {
    type: Object as PropType<SwiperOptions['pagination']>,
    default: () => ({
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    }),
  },
  navigation: {
    type: Object as PropType<SwiperOptions['navigation']>,
    default: () => ({
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }),
  },
  isNavigation: {
    type: Boolean,
    default: true,
  },
})
const swiper = ref<HTMLElement | null>(null)
onMounted(() => {
  if (swiper.value) {
    // eslint-disable-next-line no-new
    new Swiper(swiper.value, props)
  }
})
</script>

<template>
  <div ref="swiper" class="swiper">
    <div class="swiper-wrapper">
      <slot />
    </div>
    <div class="swiper-pagination" />

    <div v-if="isNavigation" class="swiper-button-next" />
    <div v-if="isNavigation" class="swiper-button-prev" />
  </div>
</template>

<style lang="scss" scoped>
</style>
