<script setup lang="ts">
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="template">
    <header class="header navbar navbar-dark sticky-top flex-wrap flex-md-nowrap shadow bg-neutral-120">
      <div class="d-flex align-items-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          class="me-2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="#8BAFD7"
          />
          <path d="M10 12L16 8L22 12V20L16 24L10 20V12Z" fill="white" />
          <path d="M16 8L22 12L16 16L10 12L16 8Z" fill="#EBF1F8" />
          <path d="M16 24V16L22 12V20L16 24Z" fill="#D3E2F2" />
          <path d="M10 20V12L16 16V24L10 20Z" fill="#E0EAF5" />
        </svg>
        <div class="d-flex flex-column">
          <h1 class="text-white fs-5 mb-0 fw-bold">
            Freyja
          </h1>
          <small class="text-white-50">後台管理系統</small>
        </div>
      </div>
      <button
        class="navbar-toggler d-lg-none me-2"
        :class="{ collapsed: !isMenuOpen }"
        type="button"
        aria-label="切換選單"
        @click="toggleMenu"
      >
        <span class="navbar-toggler-icon" />
      </button>
    </header>

    <!-- 遮罩層 -->
    <div
      v-if="isMenuOpen"
      class="overlay"
      @click="closeMenu"
    />

    <nav
      id="sidebarMenu"
      :class="{ show: isMenuOpen }"
      class="sidebar"
    >
      <div class="sidebar-content">
        <ul class="nav-list">
          <li class="nav-item">
            <NuxtLink
              to="/admin"
              class="nav-link link-hover"
              exact-active-class="active"
              @click="closeMenu"
            >
              <i class="bi bi-house fs-4 me-2" />
              首頁
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink
              to="/admin/orders"
              class="nav-link link-hover"
              exact-active-class="active"
              @click="closeMenu"
            >
              <i class="bi bi-filter-square fs-4 me-2" />
              訂單列表
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink
              to="/admin/rooms"
              class="nav-link link-hover"
              exact-active-class="active"
              @click="closeMenu"
            >
              <i class="bi bi-handbag fs-4 me-2" />
              房型管理
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink
              to="/admin/news"
              class="nav-link link-hover"
              exact-active-class="active"
              @click="closeMenu"
            >
              <i class="bi bi-card-text fs-4 me-2" />
              消息管理
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink
              to="/admin/culinary"
              class="nav-link link-hover"
              exact-active-class="active"
              @click="closeMenu"
            >
              <i class="bi bi-tags fs-4 me-2" />
              佳餚管理
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.template {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.header {
  height: 80px;
  color: #fff;
  padding: 1rem;
  text-align: center;
  font-size: 1.2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1030;
  .navbar-toggler {
    padding: 0.5rem;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 4px;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.25);
    }
  }
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1015;
}
.sidebar {
  position: fixed;
  top: 80px;
  bottom: 0;
  left: 0;
  width: 250px;
  background: #f8f9fa;
  transition: transform 0.3s ease;
  z-index: 1020;
  overflow-y: auto;

  .sidebar-content {
    padding: 1rem;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-item {
    margin-bottom: 0.5rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;
    color: #333;
    text-decoration: none;
    border-radius: 4px;

    &:hover {
      background: rgba(13, 110, 253, 0.1);
    }

    &.active {
      background: #BF9D7D;
      color: white;
    }
  }
}
.content {
  flex-grow: 1;
  margin-left: 250px;
  padding: 2rem;
  margin-top: 80px;
  transition: margin-left 0.3s ease;
}
.link-hover {
  transition: transform 0.3s ease;
  &:hover {
    transform: translateX(5px);
  }
}
// RWD 設定
@media (max-width: 992px) {
  .sidebar {
    transform: translateX(-100%);
    width: 100%;
    max-width: 250px;

    &.show {
      transform: translateX(0);
    }
  }
  .content {
    margin-left: 0;
    padding: 1rem;
  }
}
// 深色模式支援
@media (prefers-color-scheme: dark) {
  .sidebar {
    background: #2d2d2d;
    .nav-link {
      color: #fff;
      &:hover {
        background: rgba(255,255,255,0.1);
      }
    }
  }
}
</style>
