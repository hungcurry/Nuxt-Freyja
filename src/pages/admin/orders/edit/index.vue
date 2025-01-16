<script setup lang="ts">
definePageMeta({
  layout: 'adminlayout',
  middleware: ['admin-auth'],
})
navigateTo('/admin')
</script>

<template>
  <NuxtPage />
</template>

<style scoped lang="scss">
</style>
