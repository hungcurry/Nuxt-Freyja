// 有自動引入 可省略
// import { ref , reactive } from "vue";
// import { defineStore } from 'pinia'

export const CountStore = defineStore('count', () => {
  const num = ref(0)
  const addCount = () => {
    num.value++
  }
  return {
    num,
    addCount,
  }
})
