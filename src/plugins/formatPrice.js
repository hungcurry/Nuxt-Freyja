export default defineNuxtPlugin((nuxtApp) => {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  nuxtApp.provide('formatPrice', price => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
})
