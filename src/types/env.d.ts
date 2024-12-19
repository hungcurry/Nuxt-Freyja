// import.meta 原本就是內建型別，預設型別
// interface 能夠擴展內建型別，
// 因此推薦用 interface，這樣不會直接覆蓋內建型別
interface ImportMetaEnv {
  VITE_ENV: string
  VITE_WEB_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
