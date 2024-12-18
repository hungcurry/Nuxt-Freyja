<script setup lang="ts">
definePageMeta({
  name: 'user-profile',
})

const isEditPassword = ref(false)
const isEditProfile = ref(false)
</script>

<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-5">
      <div class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
        <h2 class="fs-6 fs-md-5 fw-bold">
          修改密碼
        </h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div class="fs-8 fs-md-7">
            <p class="mb-2 text-neutral-80 fw-medium">
              電子信箱
            </p>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
            >Jessica@exsample.com</span>
          </div>

          <form>
            <div
              class="d-flex justify-content-between align-items-center"
              :class="{ 'd-none': isEditPassword }"
            >
              <div>
                <input
                  type="text"
                  name="username"
                  autocomplete="username"
                  value="Jessica@exsample.com"
                  class="visually-hidden"
                >
                <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                  密碼
                </label>
                <input
                  class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                  type="password"
                  value="**********"
                  autocomplete="current-password"
                >
              </div>

              <button
                class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
                type="button"
                @click="isEditPassword = !isEditPassword"
              >
                重設
              </button>
            </div>
          </form>

          <form
            v-if="isEditPassword"
            action="/password"
            method="POST"
            class="d-flex flex-column gap-4 gap-md-6"
          >
            <input
              type="text"
              name="username"
              autocomplete="username"
              value="Jessica@exsample.com"
              class="visually-hidden"
            >
            <div>
              <label
                for="oldPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
              >舊密碼</label>
              <input
                id="oldPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                placeholder="請輸入舊密碼"
                autocomplete="current-password"
              >
            </div>

            <div>
              <label
                for="newPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
              >新密碼</label>
              <input
                id="newPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                placeholder="請輸入新密碼"
                autocomplete="new-password"
              >
            </div>

            <div>
              <label
                for="confirmPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
              >確認新密碼</label>
              <input
                id="confirmPassword"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                placeholder="請再輸入一次新密碼"
                autocomplete="new-password"
              >
            </div>

            <button
              class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
              type="submit"
            >
              儲存設定
            </button>
          </form>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-7">
      <div class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
        <h2 class="fs-6 fs-md-5 fw-bold">
          基本資料
        </h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <form
            v-if="isEditProfile"
            action="/info"
            method="POST"
            class="d-flex flex-column gap-4 gap-md-6"
          >
            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-bold text-neutral-100"
                for="name"
              >
                姓名
              </label>
              <input
                id="name"
                name="name"
                class="form-control text-neutral-100 fw-bold p-4"
                type="text"
                value="Jessica Ｗang"
                autocomplete="name"
              >
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-bold text-neutral-100"
                for="phone"
              >
                手機號碼
              </label>
              <input
                id="phone"
                name="phone"
                class="form-control text-neutral-100 fw-bold p-4"
                type="tel"
                value="+886 912 345 678"
                autocomplete="tel"
              >
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-bold text-neutral-100"
                for="birth"
              >
                生日
              </label>
              <div class="d-flex gap-2">
                <select
                  id="birth"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  autocomplete="bday-year"
                >
                  <option
                    v-for="year in 65"
                    :key="year"
                    value="`${year + 1958} 年`"
                  >
                    {{ year + 1958 }} 年
                  </option>
                </select>
                <select
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  autocomplete="bday-month"
                >
                  <option
                    v-for="month in 12"
                    :key="month"
                    value="`${month} 月`"
                  >
                    {{ month }} 月
                  </option>
                </select>
                <select
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  autocomplete="bday-day"
                >
                  <option
                    v-for="day in 30"
                    :key="day"
                    value="`${day} 日`"
                  >
                    {{ day }} 日
                  </option>
                </select>
              </div>
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-bold text-neutral-100"
                for="address"
              >
                地址
              </label>
              <div>
                <div class="d-flex gap-2 mb-2">
                  <select
                    class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                    autocomplete="address-level1"
                  >
                    <option value="臺北市">
                      臺北市
                    </option>
                    <option value="臺中市">
                      臺中市
                    </option>
                    <option
                      selected
                      value="高雄市"
                    >
                      高雄市
                    </option>
                  </select>
                  <select
                    class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                    autocomplete="address-level2"
                  >
                    <option value="前金區">
                      前金區
                    </option>
                    <option value="鹽埕區">
                      鹽埕區
                    </option>
                    <option
                      selected
                      value="新興區"
                    >
                      新興區
                    </option>
                  </select>
                </div>
                <input
                  id="address"
                  type="text"
                  class="form-control p-4 rounded-3"
                  placeholder="請輸入詳細地址"
                  autocomplete="street-address"
                >
              </div>
            </div>

            <button
              class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
              type="submit"
            >
              儲存設定
            </button>
          </form>

          <div v-else class="d-flex flex-column gap-4 gap-md-6">
            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-medium text-neutral-80"
                for="name"
              >
                姓名
              </label>
              <input
                id="name"
                name="name"
                class="form-control text-neutral-100 fw-bold pe-none p-0 border-0"
                type="text"
                value="Jessica Ｗang"
                autocomplete="name"
              >
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-medium text-neutral-80"
                for="phone"
              >
                手機號碼
              </label>
              <input
                id="phone"
                name="phone"
                class="form-control text-neutral-100 fw-bold pe-none p-0 border-0"
                type="tel"
                value="+886 912 345 678"
                autocomplete="tel"
              >
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-medium text-neutral-80"
                for="birth"
              >
                生日
              </label>
              <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0">
                1990 年 8 月 15 日
              </span>
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label fw-medium text-neutral-80"
                for="address"
              >
                地址
              </label>
              <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0">
                高雄市新興區六角路 123 號
              </span>
            </div>

            <button
              class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
              type="button"
              @click="isEditProfile = !isEditProfile"
            >
              編輯
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type="password"] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>
