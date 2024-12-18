<script setup lang="ts">
const props = defineProps({
  code: {
    type: Number,
    default: undefined,
  },
  message: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <div class="container">
    <!-- 錯誤處理 -->
    <div class="error mx-auto my-10 py-15 px-6 md:px-15 lg:max-w-[70%]">
      <p class="mr-2 inline text-3xl text-secondary">
        {{ props.code }}
      </p>
      <p class="inline text-left text-lg text-white">
        {{ props.message }}
      </p>
      <!-- <p class="block text-gray-400">－－我們找不到您要查找的頁面</p> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error {
  // background-image: url('@/assets/images/banner2.jpg');
  background-position: center;
  background-size: cover;
  border-radius: 5px;
}
p {
  letter-spacing: 2px;
}
</style>
