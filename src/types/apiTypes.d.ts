interface TRoomFeature {
  title: string
  isProvide: boolean
}
interface TUserRegister {
  name: string
  email: string
  password: string
  phone: string
  birthday: string
  address: {
    zipcode: string
    detail: string
  }
}
interface TAddress {
  zipcode: number
  detail: string
  county: string
  city: string
}
// ===================
// ... API 回應型別 ...
// ===================
// 通用的 API 格式
interface TApiResponse<T> {
  data?: T // 例如 axios 的 { data }
  result?: T // 例如 $fetch 常見的 { result }
  status?: string // 可能的 API 狀態欄位
  message?: string // 可選的訊息欄位，用於錯誤信息等
  token?: string // 可選的 token 欄位，用於登入等
}
interface TApiNewsItem {
  _id: string
  title: string
  description: string
  image: string
  createdAt: string
  updatedAt: string
}
interface TApiRoomItem {
  _id: string
  name: string
  description: string
  areaInfo: string
  bedInfo: string
  maxPeople: number
  price: number
  imageUrl: string
  imageUrlList: string[]
  layoutInfo: TRoomFeature[]
  facilityInfo: TRoomFeature[]
  amenityInfo: TRoomFeature[]
}
interface TApiUser {
  name: string
  email: string
  phone: string
  birthday: string
  address: TAddress
  verificationToken: string
  _id: string
  createdAt: string
  updatedAt: string
  id: string
}
export type { TApiNewsItem, TApiResponse, TApiRoomItem, TApiUser, TUserRegister }
