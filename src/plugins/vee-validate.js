import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import { email, min, required } from '@vee-validate/rules'
import { configure, defineRule } from 'vee-validate'

export default defineNuxtPlugin((nuxtApp) => {
  // 定義全域的規則
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)

  // 自訂驗證規則
  defineRule('username', (value) => {
    const regex = /\S{2,}$/
    return (
      regex.test(value)
      || '長度至少為2字元'
    )
  })
  defineRule('phone', (value) => {
    // /^(09)[0-9]{8}$/
    const regex = /^09\d{8}$/
    return (
      regex.test(value)
      || '請輸入正確的手機號碼格式!ex.0912345678'
    )
  })

  // 設定多國語系與驗證訊息
  configure({
    // 載入繁體中文的設定檔，產生繁體中文的驗證訊息
    generateMessage: localize({ zh_TW: zhTW }),
    validateOnInput: true, // 輸入文字時立即進行驗證
  })

  // 設定預設語言為繁體中文
  setLocale('zh_TW')
})
