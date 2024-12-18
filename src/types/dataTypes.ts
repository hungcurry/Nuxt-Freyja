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

export type { TUserRegister }
