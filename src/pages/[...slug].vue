<!-- /pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute()
const event = useRequestEvent() // 獲取當前請求的事件

// 隨便打 http://localhost:3000/Nuxt-Livecourse/999
// console.log('route', route.params.slug) // ['999']
// console.log('event', event) // event undefined
// 設定 HTTP 404 狀態碼
if (event) {
  setResponseStatus(event, 404)
}
</script>

<template>
  <h1>404 Not Found</h1>
  <p>
    你所請求的頁面：{{ Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug }}，不存在。
  </p>
  <NuxtLink to="/">
    回到首頁
  </NuxtLink>
</template>

<style scoped lang="scss">
h1 {
  color: red;
  text-align: center;
}
p {
  text-align: center;
}
</style>
