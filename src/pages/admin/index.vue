<script setup lang="ts">
const route = useRoute()
definePageMeta({
  layout: 'adminlayout',
})
</script>

<template>
  <div class="container">
    <p>目前路由的路徑 - route.fullPath為 : {{ route.fullPath }}</p>
    <h1 class="primary">
      Page: admin/index
    </h1>
    <h2 class="title">
      後台首頁
    </h2>
    <hr>
  </div>
</template>

<style lang="scss" scoped>
</style>
