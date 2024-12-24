// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'node:path'

export default defineNuxtConfig({
  // compatibilityDate 屬性 : 將 Nuxt3 的功能和行為鎖定在 2024-04-03 之前的版本，
  // 避免之後 Nuxt3 新版本的寫法調整會影響到目前專案的運作
  compatibilityDate: '2024-04-03',
  // 啟用 Nuxt DevTools 開發工具
  devtools: { enabled: true },
  // ------------------ add ----------------------
  app: {
    // baseURL: '/Nuxt-Livecourse/',
    head: {
      title: 'Freyja,Freyja 訂房',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'zh-Hant-TW',
      },
      meta: [
        { 'http-equiv': 'x-ua-compatible', 'content': 'IE=edge' },
        { 'http-equiv': 'x-content-type-options', 'content': 'nosniff' },
        { name: 'author', content: 'Freyja 旅館' },
        { name: 'keywords', content: 'Freyja,Freyja 訂房,高雄旅遊,訂房,住宿,住宿預訂,四人房,雙人房,景觀房' },
        { name: 'description', content: 'Freyja 旅館位於高雄，提供頂級的住宿體驗。享受絕美市景與高級設施，讓您的每一刻都充滿奢華與舒適。立即預訂，開啟難忘的住宿之旅！' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'robots', content: '"index, follow' },
        { property: 'fb:app_id', content: '12345678' },
        { property: 'og:locale', content: 'zh-TW' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://freyja.travel.com.tw' },
        { property: 'og:title', content: 'Freyja | 高雄頂級旅館 - 提供奢華住宿體驗' },
        { property: 'og:image', content: 'https://freyja.travel.com.tw/images/og-image.jpg' },
        { property: 'og:description', content: 'Freyja 旅館位於高雄，提供頂級的住宿體驗。享受絕美市景與高級設施，讓您的每一刻都充滿奢華與舒適。立即預訂，開啟難忘的住宿之旅！' },
      ],
      link: [
        // { rel: 'icon', type: 'image/x-icon', href: 'path/to/your/design' },
        // { rel: 'apple-touch-icon', href: 'path/to/your/design' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap',
        },
      ],
    },
    // 頁面過渡動畫
    // pageTransition: { name: 'page', mode: 'out-in' },
  },
  srcDir: 'src',
  alias: {
    '@/': `${path.resolve(__dirname, 'src')}/`,
    '@assets': `${path.resolve(__dirname, 'src/assets')}/`,
    '@components': `${path.resolve(__dirname, 'src/components')}/`,
    '@images': `${path.resolve(__dirname, 'src/assets/images')}/`,
    '@style': `${path.resolve(__dirname, 'src/assets/style')}/`,
  },
  // 引入 SCSS 檔案
  css: ['@style/all.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 解決警告 api: 'modern',
          // The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0
          api: 'modern',
          // 自動在所有元件引入 _variables.scss
          additionalData: `
            @import "@style/config/_variables2.scss";
          `,
        },
      },
    },
    plugins: [],
  },
  // 啟用 TypeScript 類型檢查
  typescript: {
    typeCheck: true,
  },
  // <NuxtLink> 元件添加指定的 class。
  router: {
    options: {
      linkActiveClass: 'active',
      linkExactActiveClass: 'active',
    },
  },
  // Auto-import pinia
  imports: {
    dirs: ['stores'],
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  modules: [
    ['@pinia/nuxt', { autoImports: ['defineStore', 'acceptHMRUpdate'] }],
    '@unocss/nuxt',
    '@nuxt/eslint',
    '@vee-validate/nuxt',
    'nuxt3-notifications',
  ],
  veeValidate: {
    // 修改 VeeValidate 元件的名稱
    componentNames: {
      Form: 'VForm',
      Field: 'VField',
      ErrorMessage: 'VErrorMessage',
    },
  },
})
