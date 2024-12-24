// 房間特徵類型
type TRoomFeature = {
  title: string
  isProvide: boolean
}
// 預訂結果類型
type TBookingInfo = {
  roomId?: string | string[]
  checkInDate?: string
  checkOutDate?: string
  bookingDays?: number
  peopleNum?: number
}
type TOrderResult = {
  userInfo?: {
    name?: string
    phone?: string
    email?: string
    address?: {
      zipcode?: string
      detail?: string
    }
  }
  areaInfo?: string
  bedInfo?: string
  layoutInfo?: TRoomFeature[]
  facilityInfo?: TRoomFeature[]
  amenityInfo?: TRoomFeature[]
  imageUrl?: string
  name?: string
  totalPrice?: number
}
// 用戶註冊類型
type TUserRegister = {
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
// 選單項目類型
type TMenuItem = {
  label: string
  path: string
}
type Framework = {
  path: string
  name: string
  count: number
}
// 投票類型
type TFrameworks = {
  [key: string]: Framework
}
// todo list
type TRegistrationForm = {
  email: string
  password: string
  nickname: string
}
type TLoginForm = {
  email: string
  password: string
}
type TTodo = {
  id: number
  createTime: string
  content: string
  status: boolean
}
export type {
  TBookingInfo,
  TFrameworks,
  TLoginForm,
  TMenuItem,
  TOrderResult,
  TRegistrationForm,
  TRoomFeature,
  TTodo,
  TUserRegister,
}
