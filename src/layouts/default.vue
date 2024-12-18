<script setup lang="ts"></script>

<template>
  <div class="template">
    <Header />
    <main class="content">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style scoped lang="scss">
.template {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex-grow: 1;
}
</style>
