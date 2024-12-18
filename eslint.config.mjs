import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    vue: {
      overrides: {
        // 關閉多個模板根節點的檢查
        'vue/no-multiple-template-root': 'off',
        // 關閉未使用變數的檢查
        'no-unused-vars': 'off',
        // 禁用 unused-imports 插件的規則
        'unused-imports/no-unused-vars': 'off',
        // 關閉console的檢查
        'no-console': 'off',
        // 強制檢查腳本和樣式語言
        'vue/block-lang': [
          'error',
          {
            script: {
              lang: ['js', 'ts'],
            },
            style: {
              lang: 'scss',
            },
          },
        ],
        // 強制組件名稱使用 PascalCase
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        // 要求 props 定義應該盡可能詳細
        'vue/require-prop-types': 'error',
        // 禁止在同一行中出現多個屬性
        'vue/max-attributes-per-line': ['error', {
          singleline: 3,
          multiline: 1,
        }],
      },
    },
    javascript: {
      overrides: {
        // 禁止使用未定義的變數
        'no-undef': 'error',
        // 禁止出現無用的表達式
        'no-unused-expressions': 'error',
        // 要求使用 const 宣告那些聲明後不再被修改的變數
        'prefer-const': 'error',
        // 強制使用分號
        'semi': 'off',
        // 強制使用單引號
        'quotes': ['error', 'single'],
        // 禁止使用多餘的空格
        'no-multi-spaces': 'error',
        // 關閉未使用變數的檢查 // ['warn']
        'no-unused-vars': 'off',
        // 禁用 unused-imports 插件的規則
        'unused-imports/no-unused-vars': 'off',
      },
    },
    typescript: {
      overrides: {
        // 關閉函式必須明確返回類型的檢查
        '@typescript-eslint/explicit-function-return-type': 'off',
        // 警告使用 any 類型
        '@typescript-eslint/no-explicit-any': 'off',
        // 禁止使用 namespace
        '@typescript-eslint/no-namespace': 'error',
        // 關閉未使用變數的檢查 // ['warn']
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  }),
)
