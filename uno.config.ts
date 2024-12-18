import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    // UnoCSS 的預設 utility classes
    presetUno(),
    // 支援 HTML 屬性模式，像是 `bg="red-500"`
    presetAttributify(),
    presetIcons({
      scale: 1.2, // 調整圖示大小
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  // theme: {
  //   colors: {
  //     primary: '#1E40AF', // 自訂主色
  //     secondary: '#64748B',
  //   },
  // },
  // shortcuts: {
  //   btn: 'px-4 py-2 rounded bg-primary text-white hover:bg-primary-700',
  // },
})
