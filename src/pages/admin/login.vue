<script setup lang="ts">
type TProps = {
  status?: boolean
  title?: string
}
const isAdmin = ref<TProps>({
  status: true,
  title: '登入後台系統',
})

definePageMeta({
  layout: 'registerlayout',
})
</script>

<template>
  <AccountLogin v-bind="isAdmin" />
</template>

<style lang="scss" scoped>
</style>
