# Freyja 旅館訂房平台

## 畫面截圖

<img src="https://i.imgur.com/1jHksCz.png" alt="page-screenshot"/>

## 專案簡介

本專案是一個專為 Freyja 旅館設計的訂房平台，使用 **Nuxt.js** 技術完成前端開發，
結合 **MongoDB** 作為資料庫，並部署於 **Vercel** 平台。

## 專案負責內容

- **前端開發**：
  - 使用 **Nuxt.js** 完成網站前端邏輯與動態資料綁定。
  - 整合 **Render** 提供的 API，實現訂房功能。
- **後端部署**：
  - 後端程式碼 **Express.js**，將其部署至 **Render**，並完成 **MongoDB** 資料庫的配置與連接。
  - 產生 **Swagger** 文件，測試 API 。

## 特色功能

- **房型資訊展示**：呈現 Freyja 旅館的房型資訊。
- **訂房系統整合**：可選擇入住日期、房型與人數等，完成訂房流程。
- **響應式設計**：確保手機與桌面裝置上的良好瀏覽體驗。
- **使用者後台**： 串接相關 API ，可在後台進行房型、訂單的新增、編輯、刪除等行為。
- **SEO 優化**：內嵌的 `meta` 資訊提高網站的 SEO 排名。

## 技術棧

- **前端框架**：Nuxt.js 3 + TypeScript
- **後端技術**：Express.js + mongoose
- **資料庫**：MongoDB
- **部署平台**：Vercel(前端) + Render(後端)
- **CSS 框架**：Bootstrap 5 + Unocss
- **使用套件**： VCalendar、SweetAlert2、day.js、vee-validate、vue-screen-utils、notifications
