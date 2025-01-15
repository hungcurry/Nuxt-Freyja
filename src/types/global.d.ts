declare global {
  module '#app' {
    interface NuxtApp {
      $formatPrice: (price: number) => string
    }
  }
  module 'node' {
    interface ProcessEnv extends Record<string, string | number> {
      readonly PORT: number
      readonly DATABASE: string
      readonly DATABASE_PASSWORD: string
      readonly JWT_EXPIRES_DAY: string
      readonly JWT_SECRET: string
      readonly EMAILER_USER: string
      readonly EMAILER_PASSWORD: string
      readonly NODE_ENV: 'development' | 'production'
    }
  }
  module 'express' {
    // 擴展 Express Request 介面
    interface Request {
      user?: IUser | null
    }
  }
  // 瀏覽器全域變數
  interface Window {
    customMethod: () => void
  }
  // Vite 環境變數類型
  // import.meta 原本就是內建型別，預設型別
  // interface 能夠擴展內建型別，
  // 因此推薦用 interface，這樣不會直接覆蓋內建型別
  interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_URL_SWAGGER: string
    readonly VITE_API_URL_GITLAB: string
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
