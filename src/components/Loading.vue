<script setup lang="ts">
defineProps({
  active: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <!-- <div class="loading" v-if="active">Loading...</div> -->
  <div v-if="active" class="loadingBox">
    <div class="loading">
      <div />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loadingBox {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: transparent;
  transform: scale(0.3);
  .loading {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0;
    div {
      position: absolute;
      width: 120px;
      height: 120px;
      border: 20px solid $primary;
      border-top-color: transparent;
      border-radius: 50%;
      box-sizing: content-box;
      animation: loading 0.6s linear infinite;
      top: 100px;
      left: 100px;
    }
  }
}
@keyframes loading {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
