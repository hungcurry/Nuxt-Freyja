<script setup lang="ts">
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const userId = userInfo?.value?.id
navigateTo({
  name: 'user-userId',
  params: { userId },
})
</script>

<template>
  <div>user/index</div>
</template>

<style scoped lang="scss">
</style>
