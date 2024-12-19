import type { TRoomFeature } from '@/types/dataTypes'
/** API 詳細基礎回應結構 */
type TApiBaseResponse = {
  status: boolean | 'success' | 'error' | 'fail' | 'ok'
  message?: string
  code?: number
  details?: unknown
}
/** 詳細失敗回應結構 */
type TApiFailureResponse = Omit<TApiBaseResponse, 'status'> & {
  status: false | 'error' | 'fail'
  message: string // 確保失敗回應中必定有錯誤訊息
  [key: string]: unknown
}
/** 詳細成功回應結構 */
type TApiSuccessResponse<T = unknown> = Omit<TApiBaseResponse, 'status'> & {
  status: true | 'success' | 'ok'
  data?: T
  result?: T
  token?: string
  [key: string]: unknown
}
/** API 詳細回應型別 */
type TApiResponse<T = unknown> = TApiSuccessResponse<T> | TApiFailureResponse

/** API 通用回應型別 */
type TApiGenericResponse<T> = {
  data?: T
  result?: T
  status?: string
  message?: string
  token?: string
  [key: string]: T
}
// ===================
// ... 項目類型 ...
// ===================
// 新聞項目類型
type TApiNewsItem = {
  _id: string
  title: string
  description: string
  image: string
  createdAt: string
  updatedAt: string
}
// 房間項目類型
type TApiRoomItem = {
  _id: string
  name: string
  description: string
  imageUrl: string
  imageUrlList: string[]
  areaInfo: string
  bedInfo: string
  maxPeople: number
  price: number
  status: number
  layoutInfo: TRoomFeature[]
  facilityInfo: TRoomFeature[]
  amenityInfo: TRoomFeature[]
  createdAt: string
  updatedAt: string
  totalPrice?: number
}
// 用戶類型
type TApiUser = {
  address: {
    zipcode: string | number
    county: string
    district: string
    detail: string
  }
  name: string
  email: string
  phone: string
}
// 認證類型
type TApiAuth = {
  status: boolean
  token: string
}
export type {
  TApiAuth,
  TApiBaseResponse,
  TApiFailureResponse,
  TApiGenericResponse,
  TApiNewsItem,
  TApiResponse,
  TApiRoomItem,
  TApiSuccessResponse,
  TApiUser,
}
