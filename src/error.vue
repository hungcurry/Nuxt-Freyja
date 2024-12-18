<script setup lang="ts">
const props = defineProps({
  error: Object,
})
// import SlotBack from '@/components/Slots/SlotBack.vue'
const state = ref(0)
const message = ref('')
const { error } = toRefs(props)
// 打 http://localhost:3000/Nuxt-Livecourse/api/error 會觸發錯誤
// 添加錯誤檢查
const errorCode = error?.value?.statusCode ? Number(error.value.statusCode) : 0
const errorMessage = error?.value?.statusMessage || ''

if (errorCode === 500) {
  state.value = errorCode
  message.value = errorMessage
}
if (errorCode === 400) {
  state.value = errorCode
  message.value = errorMessage
}
// const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <!-- 錯誤處理 -->
    <h1>錯誤處理</h1>
    <ErrorMessage :code="state" :message="message" />
    <!-- <slot-back @click="handleError">回首頁</slot-back> -->
  </NuxtLayout>
</template>

<style lang="scss" scoped></style>
